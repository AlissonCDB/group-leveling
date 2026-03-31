import { createClient } from '@/utils/supabase/client';

export const classService = {
  async getAllClasses() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('Class')
      .select('id, name_class, reference_class, description_class') // Adicionado description_class
      .order('name_class', { ascending: true });

    if (error) {
      console.error('Erro ao buscar classes:', error.message);
      throw error;
    }

    return data;
  }
};