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
                ),
                semester:graduation ( option ),
                work_type:type ( option )
            `)
            // Ordena pelos mais recentes (ID maior)
            .order('id', { ascending: false });

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
    },

    async getUserWorks(supabase, userId) {
        const { data } = await supabase
            .from('Work')
            .select('*')
            .eq('user_id', userId)
            .order('id', { ascending: false });

        return data || [];
    },

    async getDownloadedWorks(supabase, userId) {
        const { data } = await supabase
            .from('User_Work')
            .select(`id, rating, comment, Work ( *, User (user_name, last_name) )`)
            .eq('id_user', userId);

        if (!data) return [];

        // Lógica de tratamento transferida para cá
        return data
            .filter(item => item.Work && item.Work.user_id !== userId)
            .map(item => ({
                ...item.Work,
                user_work_id: item.id,
                user_rating: item.rating,
                user_comment: item.comment
            }))
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    
    async registerWorkDownload(supabase, workId, userId) {
        // 1. Verifica se já existe o registo de acesso
        const { data: existingRecord, error: searchError } = await supabase
            .from('User_Work')
            .select('id')
            .eq('id_user', userId)
            .eq('id_work', workId)
            .maybeSingle();

        if (searchError) throw searchError;

        // 2. Se não existir, cria o novo vínculo
        if (!existingRecord) {
            const { error: insertError } = await supabase
                .from('User_Work')
                .insert([{ id_user: userId, id_work: workId }]);
                
            if (insertError) throw insertError;
        }
    }
};