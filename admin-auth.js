// ══════════════════════════════════════════════════════════════════
//  Auth guard (utilisé sur toutes les pages admin)
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('terminal-body')) {
        initSSHTerminal();
    }
});

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session  && window.location.pathname.includes('admin-login'))     window.location.href = 'admin-dashboard.html';
    if (!session && window.location.pathname.includes('admin-dashboard')) window.location.href = 'admin-login.html';
}

async function logout() {
    try {
        await supabase.auth.signOut();
        window.location.href = 'admin-login.html';
    } catch (e) {
        console.error('Logout error:', e);
    }
}

// ══════════════════════════════════════════════════════════════════
//  Interface SSH terminal
// ══════════════════════════════════════════════════════════════════

function initSSHTerminal() {

    // ── Éléments DOM
    const termOutput = document.getElementById('terminal-output');
    const inputLine  = document.getElementById('input-line');
    const termInput  = document.getElementById('terminal-input');
    const promptEl   = document.getElementById('terminal-prompt');
    const termBody   = document.getElementById('terminal-body');

    // ── État
    let state     = 'BOOT';   // BOOT | WAITING_SSH | WAITING_YESNO | WAITING_PASSWORD | BUSY
    let sshEmail  = '';
    let sshHost   = '';
    let attempts  = 0;
    const MAX_TRIES = 3;

    // ── Utilitaires
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addLine(html = '', cls = '') {
        const div = document.createElement('div');
        div.className = 'terminal-line' + (cls ? ' ' + cls : '');
        div.innerHTML = html;
        termOutput.appendChild(div);
        termBody.scrollTop = termBody.scrollHeight;
        return div;
    }

    async function typeLines(lines) {
        for (const l of lines) {
            if (l.delay) await sleep(l.delay);
            addLine(l.text ?? '', l.cls ?? '');
        }
    }

    function echoInputLine(promptText, value) {
        const div = document.createElement('div');
        div.className = 'terminal-line cmd';
        const span = document.createElement('span');
        span.style.opacity = '0.65';
        span.textContent = promptText;
        div.appendChild(span);
        div.appendChild(document.createTextNode(value));
        termOutput.appendChild(div);
        termBody.scrollTop = termBody.scrollHeight;
    }

    function setPrompt(text, type = 'text') {
        promptEl.textContent = text;
        termInput.type = type;
        termInput.value = '';
        inputLine.style.display = 'flex';
        // rAF garantit que display:flex est rendu avant d'appeler focus()
        requestAnimationFrame(() => termInput.focus());
    }

    function hideInput() {
        inputLine.style.display = 'none';
        termInput.value = '';
    }

    function generateFingerprint() {
        const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        return Array.from({ length: 43 }, () => c[rand(0, c.length - 1)]).join('');
    }

    function fakeLastLogin() {
        const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const d = new Date();
        d.setDate(d.getDate() - rand(1, 6));
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${days[d.getDay()]} ${months[d.getMonth()]} ${String(d.getDate()).padStart(2,' ')} ${hh}:${mm}:${ss} ${d.getFullYear()}`;
    }

    // ── Séquence de boot
    async function boot() {
        hideInput();
        await sleep(120);
        addLine('Microsoft Windows [version 10.0.26200.8246]', 'dim');
        addLine('(c) Microsoft Corporation. Tous droits réservés.', 'dim');
        addLine('', 'dim');
        await sleep(350);
        state = 'WAITING_SSH';
        setPrompt('C:\\Users\\Redouane>');
    }

    // ── Gestion commande SSH
    async function handleSSH(cmd) {
        const raw = cmd.trim();

        // Commande vide
        if (!raw) return;

        // clear
        if (raw === 'clear') {
            termOutput.innerHTML = '';
            return;
        }

        // Toute autre commande non-ssh
        const sshMatch = raw.match(/^ssh\s+([^\s@]+@[^\s]+)$/i);
        if (!sshMatch) {
            const bin = raw.split(/\s+/)[0];
            addLine(`bash: ${bin}: command not found`, 'error');
            return;
        }

        // SSH valide : ssh user@host
        sshEmail = sshMatch[1];           // ex: admin@rddev.fr (= email Supabase)
        sshHost  = sshEmail.split('@')[1] || sshEmail;

        state = 'BUSY';
        hideInput();

        const fp  = generateFingerprint();
        const ip  = `${rand(80,200)}.${rand(10,220)}.${rand(1,250)}.${rand(1,253)}`;

        await typeLines([
            { text: `The authenticity of host '${sshHost} (${ip})' can't be established.`, delay: 250 },
            { text: `ED25519 key fingerprint is SHA256:${fp}.`,                            delay: 180 },
            { text: `This key is not known by any other names.`,                           delay: 150 },
            { text: `Are you sure you want to continue connecting (yes/no/[fingerprint])?`,delay: 200 },
        ]);

        await sleep(220);
        state = 'WAITING_YESNO';
        setPrompt('> ');
    }

    // ── Gestion yes/no
    async function handleYesNo(answer) {
        const a = answer.trim().toLowerCase();

        if (a !== 'yes' && a !== 'no' && a !== 'y' && a !== 'n') {
            addLine(`Please type 'yes' or 'no': `, '');
            return; // le fallback du keydown handler rappelle setPrompt('> ')
        }

        if (a === 'no' || a === 'n') {
            addLine('Host key verification failed.', 'error');
            await sleep(150);
            addLine('');
            state = 'WAITING_SSH';
            sshEmail = '';
            sshHost  = '';
            setPrompt('C:\\Users\\Redouane>');
            return;
        }

        // yes
        state = 'BUSY';
        hideInput();
        addLine(`Warning: Permanently added '${sshHost}' (ED25519) to the list of known hosts.`, 'warning');
        await sleep(350);

        attempts = 0;
        state = 'WAITING_PASSWORD';
        setPrompt(`${sshEmail}'s password: `, 'password');
    }

    // ── Gestion mot de passe
    async function handlePassword(password) {
        state = 'BUSY';
        hideInput();

        // Délai réaliste (simule la latence réseau)
        const dot = addLine('', 'dim');
        await sleep(500 + rand(0, 500));
        dot.remove();

        attempts++;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email:    sshEmail,
                password: password
            });
            if (error) throw error;

            // ── Succès
            await typeLines([
                { text: '' },
                { text: `Welcome to Portfolio Admin System (GNU/Linux 6.5.0)`, cls: 'success', delay: 80 },
                { text: `Last login: ${fakeLastLogin()} from ${rand(1,254)}.${rand(1,254)}.${rand(1,254)}.${rand(1,254)}`, cls: 'dim', delay: 120 },
                { text: '' },
                { text: `Redirecting to dashboard...`, cls: 'dim', delay: 200 },
            ]);
            await sleep(1100);
            window.location.href = 'admin-dashboard.html';

        } catch (_) {
            if (attempts >= MAX_TRIES) {
                // Trop de tentatives — déconnexion
                await typeLines([
                    { text: `${sshEmail}@${sshHost}: Permission denied (publickey,password).`, cls: 'error', delay: 100 },
                    { text: '' },
                    { text: `Received disconnect from ${sshHost}: Too many authentication failures`, cls: 'error', delay: 200 },
                    { text: `Connection to ${sshHost} closed by remote host.`, cls: 'dim', delay: 300 },
                    { text: '' },
                ]);
                await sleep(700);
                // Reset complet
                state    = 'WAITING_SSH';
                attempts = 0;
                sshEmail = '';
                sshHost  = '';
                setPrompt('C:\\Users\\Redouane>');
            } else {
                addLine(`${sshEmail}@${sshHost}: Permission denied, please try again.`, 'error');
                await sleep(280);
                state = 'WAITING_PASSWORD';
                setPrompt(`${sshEmail}'s password: `, 'password');
            }
        }
    }

    // ── Listener clavier
    termInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;

        const value = termInput.value;

        if (state === 'WAITING_SSH') {
            echoInputLine('C:\\Users\\Redouane>', value);
            hideInput();
            await handleSSH(value);
            if (state === 'WAITING_SSH') setPrompt('C:\\Users\\Redouane>');

        } else if (state === 'WAITING_YESNO') {
            echoInputLine('> ', value);
            hideInput();
            await handleYesNo(value);
            // Fallback : si handleYesNo est revenu sans changer l'état (entrée invalide),
            // on réaffiche le prompt > pour que l'utilisateur puisse retaper
            if (state === 'WAITING_YESNO') setPrompt('> ');

        } else if (state === 'WAITING_PASSWORD') {
            echoInputLine(`${sshEmail}'s password: `, ''); // ne pas afficher le mdp
            hideInput();
            await handlePassword(value);
        }
    });

    // Clic sur le terminal → focus input
    termBody.addEventListener('click', () => {
        if (state !== 'BUSY') termInput.focus();
    });

    // ── Démarrage
    boot();
}
