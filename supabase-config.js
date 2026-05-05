// SUPABASE_URL et SUPABASE_ANON_KEY sont injectés par supabase-credentials.js chargé avant ce script
if (typeof window.supabase?.createClient === 'function') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('Supabase library not loaded — dynamic content unavailable.');
    window.supabase = null;
}

// Helpers internes
function _list(table, orderCol = 'id') {
    return async () => {
        const { data, error } = await supabase.from(table).select('*').order(orderCol, { ascending: true });
        if (error) throw error;
        return data || [];
    };
}

function _single(table) {
    return async () => {
        const { data, error } = await supabase.from(table).select('*').limit(1).single();
        if (error) throw error;
        return data;
    };
}

function _update(table) {
    return async (id, updates) => {
        const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    };
}

function _create(table) {
    return async (item) => {
        const { data, error } = await supabase.from(table).insert([item]).select().single();
        if (error) throw error;
        return data;
    };
}

function _delete(table) {
    return async (id) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
    };
}

const portfolioAPI = {
    getHero:            _single('hero'),
    updateHero:         _update('hero'),

    getProjects:        _list('projects', 'order_index'),
    createProject:      _create('projects'),
    updateProject:      _update('projects'),
    deleteProject:      _delete('projects'),

    getSkills:          _list('skills', 'order_index'),
    createSkill:        _create('skills'),
    updateSkill:        _update('skills'),
    deleteSkill:        _delete('skills'),

    getAbout:           _single('about'),
    updateAbout:        _update('about'),

    getExperience:      _list('experience', 'order_index'),
    createExperience:   _create('experience'),
    updateExperience:   _update('experience'),
    deleteExperience:   _delete('experience'),

    getEducation:       _list('education', 'order_index'),
    createEducation:    _create('education'),
    updateEducation:    _update('education'),
    deleteEducation:    _delete('education'),

    getContact:         _single('contact'),
    updateContact:      _update('contact'),

    getBtsFiches:       _single('bts_fiches'),
    updateBtsFiches:    _update('bts_fiches'),
};
