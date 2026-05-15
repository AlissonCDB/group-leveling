export const userService = {
    async getCurrentUserId(supabase) {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) return null;

            const { data: userData, error } = await supabase
                .from('User')
                .select('id')
                .eq('id_login', authUser.id)
                .single();

            if (error || !userData) {
                console.error("Erro ao buscar dados do usuário:", error.message);
                return null;
            }

            return userData.id;
        } catch (error) {
            console.error("Erro na validação do usuário:", error);
            return null;
        }
    },

    async getAuthenticatedProfile(supabase) {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return null;

        const { data: profileData, error } = await supabase
            .from('User')
            .select('*, Class ( name_class, reference_class, description_class )')
            .eq('id_login', authUser.id)
            .single();

        if (error) {
            console.error("Erro ao buscar perfil:", error);
            return null;
        }

        return profileData;
    },

    async updateUserProfile(supabase, userId, updateData) {
        try {
            const { data, error } = await supabase
                .from('User')
                .update(updateData) // Ex: { user_name: "Novo Nome", last_name: "Novo Sobrenome" }
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error("Erro ao atualizar perfil no Supabase:", error);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            console.error("Erro inesperado ao atualizar perfil:", error);
            return { success: false, error };
        }
    }
};