// Configuration Supabase
const SUPABASE_URL = 'https://bhfastbtpfqqggaukxmo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmFzdGJ0cGZxcWdnYXVreG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5NDcsImV4cCI6MjA3OTA4MTk0N30.k9IJSDLXLRGQZLhy-LlIkgiTm78JTYb_1_3LttBOuuc';

window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
};
