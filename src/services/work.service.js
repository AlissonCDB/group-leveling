export const workService = {
    /**
     * Cria um novo trabalho no banco de dados
     * @param {Object} supabase - Instância do Supabase
     * @param {Object} workData - Objeto contendo { type, archive, subject, graduation, user_id }
     */
    async createWork(supabase, workData) {
        const { data, error } = await supabase
            .from('Work')
            .insert([workData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Busca todos os trabalhos cadastrados TAZENDO OS DADOS DO AUTOR
     */
    async getAllWorks(supabase) {
        const { data, error } = await supabase
            .from('Work')
            .select(`
                *,
                User:user_id (
                  user_name,
                  last_name,
                  Class ( name_class )
                )
            `)
            .order('id', { ascending: false }); // Ordena pelos mais recentes (ID maior)

        if (error) throw error;
        return data;
    },

    /**
     * Busca trabalhos por um campo específico (ex: por graduação) COM DADOS DO AUTOR
     */
    async getWorksByGraduation(supabase, graduation) {
        const { data, error } = await supabase
            .from('Work')
            .select(`
                *,
                User:user_id (
                  user_name,
                  last_name,
                  Class ( name_class )
                )
            `)
            .eq('graduation', graduation);

        if (error) throw error;
        return data;
    }
};