import { supabase } from '../config/supabase';

// Client operations
export const clientOperations = {
  async getAllClients() {
    console.log('Attempting to fetch clients from Supabase...');
    console.log('Supabase instance:', supabase);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('lastname', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Successfully fetched clients:', data);
      return data;
    } catch (error) {
      console.error('Error in getAllClients:', error);
      throw error;
    }
  },

  async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateClient(id, clientData) {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Case operations
export const caseOperations = {
  async getAllCases() {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(id, firstname, lastname)
      `)
      .order('dateopened', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCasesByClient(clientId) {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        client:clients(id, firstname, lastname)
      `)
      .eq('clientid', clientId)
      .order('dateopened', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCase(caseData) {
    const { data, error } = await supabase
      .from('cases')
      .insert([caseData])
      .select(`
        *,
        client:clients(id, firstname, lastname)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCase(id, caseData) {
    const { data, error } = await supabase
      .from('cases')
      .update(caseData)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, firstname, lastname)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCase(id) {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}; 