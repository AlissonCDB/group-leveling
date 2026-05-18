export const meetingService = {
    /**
     * Cria uma nova reunião no banco de dados
     * @param {Object} supabase - Instância do Supabase
     * @param {Object} meetingData
     */
    async createRaid(supabase, meetingData, userId) {
        const { data: raidData, error: raidError } = await supabase
            .from('Meeting')
            .insert([meetingData])
            .select()
            .single();

        if (raidError) throw raidError;

        // Captura o ID gerado (flexível para 'id' ou 'id_meeting')
        const generatedId = raidData.id || raidData.id_meeting;

        const { error: linkError } = await supabase
            .from('User_Meeting')
            .insert([{
                id_meeting: generatedId,
                id_user: userId
            }]);

        if (linkError) throw linkError;

        return raidData;
    },

    // Busca todas as raids e normaliza os IDs para o frontend
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
                group_category ( option ),
                User_Meeting ( id_user ) 
            `);

        if (error) throw error;

        return data.map(raid => {
            const raidId = raid.id || raid.id_meeting;
            return {
                ...raid,
                id: raidId, // Garante que o frontend sempre veja .id
                current_participants: raid.User_Meeting?.length || 0,
                is_full: (raid.User_Meeting?.length || 0) >= (raid.user_limit || 0) && (raid.user_limit > 0)
            };
        });
    },

    async updateRaid(supabase, meetingId, updateData) {
        if (!meetingId) throw new Error("ID da reunião é obrigatório.");

        const { data, error } = await supabase
            .from('Meeting')
            .update(updateData)
            .eq('id', meetingId) // Se sua coluna no banco for 'id_meeting', troque aqui
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Realiza o vínculo do usuário com a reunião
    async joinMeeting(supabase, meetingId, userId) {
        if (!meetingId) throw new Error("ID da reunião é obrigatório.");

        const { data, error } = await supabase
            .from('User_Meeting')
            .insert([{ id_meeting: meetingId, id_user: userId }])
            .select();

        if (error) {
            if (error.code === '23505') return { alreadyIn: true };
            throw error;
        }
        return data;
    },

    //Remove o vínculo do usuário com a reunião
    async leaveMeeting(supabase, meetingId, userId) {
        if (!meetingId || !userId) throw new Error("ID da reunião e do utilizador são obrigatórios.");

        const { data, error } = await supabase
            .from('User_Meeting')
            .delete()
            .match({ id_meeting: meetingId, id_user: userId });

        if (error) throw error;
        return data;
    },

    async getUserMeetings(supabase, userId) {
        const { data } = await supabase
            .from('Meeting')
            .select('*, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option)')
            .eq('creator', userId)
            .order('meeting_date', { ascending: false });

        return data || [];
    },

    async getParticipatedMeetings(supabase, userId) {
        const { data } = await supabase
            .from('User_Meeting')
            .select(`id, rating, comment, Meeting ( *, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option), User (user_name, last_name) )`)
            .eq('id_user', userId);

        if (!data) return [];

        // Lógica de tratamento transferida para cá
        return data
            .filter(item => item.Meeting && item.Meeting.creator !== userId)
            .map(item => ({
                ...item.Meeting,
                user_meeting_id: item.id,
                user_rating: item.rating,
                user_comment: item.comment
            }))
            .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));
    }
};