// Configuration Supabase
const SUPABASE_URL = 'https://bhfastbtpfqqggaukxmo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmFzdGJ0cGZxcWdnYXVreG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDU5NDcsImV4cCI6MjA3OTA4MTk0N30.k9IJSDLXLRGQZLhy-LlIkgiTm78JTYb_1_3LttBOuuc';

// Initialiser le client Supabase sans redéclarer l'identifiant global "supabase"
// On réutilise le namespace fourni par le CDN en le remplaçant par le client
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// API Portfolio adaptée à votre structure
const portfolioAPI = {
  // Hero Section
  async getHero() {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single();
    if (error) console.error('Error loading hero:', error);
    return data;
  },
  
  async updateHero(id, updates) {
    const { data, error } = await supabase
      .from('hero')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error loading projects:', error);
    return data || [];
  },
  
  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error loading skills:', error);
    return data || [];
  },
  
  async createSkill(skill) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async updateSkill(id, updates) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async deleteSkill(id) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // About
  async getAbout() {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .limit(1)
      .single();
    if (error) console.error('Error loading about:', error);
    return data;
  },
  
  async updateAbout(id, updates) {
    const { data, error } = await supabase
      .from('about')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Experience
  async getExperience() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error loading experience:', error);
    return data || [];
  },
  
  async createExperience(experience) {
    const { data, error } = await supabase
      .from('experience')
      .insert([experience])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async updateExperience(id, updates) {
    const { data, error } = await supabase
      .from('experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async deleteExperience(id) {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Education
  async getEducation() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error loading education:', error);
    return data || [];
  },
  
  async createEducation(education) {
    const { data, error } = await supabase
      .from('education')
      .insert([education])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async updateEducation(id, updates) {
    const { data, error } = await supabase
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  async deleteEducation(id) {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Contact
  async getContact() {
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .limit(1)
      .single();
    if (error) console.error('Error loading contact:', error);
    return data;
  },
  
  async updateContact(id, updates) {
    const { data, error } = await supabase
      .from('contact')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
