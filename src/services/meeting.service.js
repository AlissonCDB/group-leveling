export const meetingService = {
    /**
     * @param {Object} supabase - Instância (client ou server) passada por quem chama
     */
    async createRaid(supabase, meetingData) {
        const { data, error } = await supabase
            .from('Meeting')
            .insert([meetingData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getActiveRaids(supabase) {
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('Meeting')
            .select(`
                *,
                User:creator (
                  user_name,
                  last_name,
                  Class ( name_class )
                )
            `)
            .gte('meeting_date', now)
            .order('meeting_date', { ascending: true });

        if (error) throw error;
        return data;
    }
};