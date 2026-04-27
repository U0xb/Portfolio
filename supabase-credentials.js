(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) module.exports = factory();
    else { const c = factory(); root.SUPABASE_URL = c.SUPABASE_URL; root.SUPABASE_ANON_KEY = c.SUPABASE_ANON_KEY; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    return {
        SUPABASE_URL:     'https://bhfastbtpfqqggaukxmo.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmFzdGJ0cGZxcWdnYXVreG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5NDcsImV4cCI6MjA3OTA4MTk0N30.k9IJSDLXLRGQZLhy-LlIkgiTm78JTYb_1_3LttBOuuc'
    };
});
