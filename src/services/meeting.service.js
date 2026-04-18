export const meetingService = {
    async createRaid(supabase, meetingData) {
        const { data, error } = await supabase
            .from('Meeting')
            .insert([meetingData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateRaid(supabase, meetingId, meetingData) {
        const { data, error } = await supabase
            .from('Meeting')
            .update(meetingData)
            .eq('id', meetingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // RENOMEADO E ATUALIZADO: Agora traz o histórico completo
    async getAllRaids(supabase) {
        const { data, error } = await supabase
            .from('Meeting')
            .select(`
                *,
                User:creator (
                  user_name,
                  last_name,
                  Class ( name_class )
                ),
                plataform_meeting ( option ),
                theme ( option ),
                meeting_tamplate ( option ),
                group_category ( option )
            `); 
            // Removemos o .gte() e o .order() daqui para o Frontend controlar a ordenação

        if (error) throw error;
        return data;
    }
};