export const meetingService = {
    // Cria uma nova Raid e já vincula o criador a ela
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
    }
};