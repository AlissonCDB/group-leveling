export const ratingService = {
    /**
     * Regista ou atualiza a avaliação (voto/comentário) de um participante sobre uma Raid.
     * @param {Object} supabase - Instância do Supabase client
     * @param {number|string} userMeetingId - ID único do registo na tabela User_Meeting
     * @param {number} rating - O valor do voto (1 para Upvote, -1 para Downvote)
     * @param {string|null} comment - Comentário/feedback opcional do utilizador
     */
    async rateRaid(supabase, userMeetingId, rating, comment) {
        if (!userMeetingId) throw new Error("ID do vínculo da reunião é obrigatório.");

        const { data, error } = await supabase
            .from('User_Meeting')
            .update({ rating, comment: comment?.trim() || null })
            .eq('id', userMeetingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Regista ou atualiza a avaliação (voto/comentário) de um utilizador sobre um Material Académico.
     * @param {Object} supabase - Instância do Supabase client
     * @param {number|string} userWorkId - ID único do registo na tabela User_Work
     * @param {number} rating - O valor do voto (1 para Upvote, -1 para Downvote)
     * @param {string|null} comment - Comentário/feedback opcional do utilizador
     */
    async rateWork(supabase, userWorkId, rating, comment) {
        if (!userWorkId) throw new Error("ID do vínculo do trabalho é obrigatório.");

        const { data, error } = await supabase
            .from('User_Work')
            .update({ rating, comment: comment?.trim() || null })
            .eq('id', userWorkId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};