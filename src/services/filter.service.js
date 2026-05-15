export const filterService = {
    async getAllFilters(supabase) {
        const { data, error } = await supabase.from('Filters').select('*');
        if (error) throw error;
        return data || [];
    },

    async getFiltersGrouped(supabase) {
        const data = await this.getAllFilters(supabase);

        return {
            // Filtros de Raids
            categories: data.filter(f => f.category?.trim().toLowerCase() === 'group_category'),
            templates: data.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate'),
            themes: data.filter(f => f.category?.trim().toLowerCase() === 'theme'),
            platforms: data.filter(f => f.category?.trim().toLowerCase() === 'plataform_meeting'),
            
            // Filtros de Trabalhos
            workTypes: data.filter(f => f.category?.trim().toLowerCase() === 'work_type'),
            semester: data.filter(f => f.category?.trim().toLowerCase() === 'semester')
        };
    }
};