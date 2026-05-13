export const filterService = {
    /**
     * Busca todos os filtros brutos do banco de dados.
     */
    async getAllFilters(supabase) {
        const { data, error } = await supabase.from('Filters').select('*');
        if (error) throw error;
        return data || [];
    },

    /**
     * Busca todos os filtros e já os devolve organizados por categoria.
     * Isso elimina a necessidade de fazer .filter() nos componentes.
     */
    async getFiltersGrouped(supabase) {
        const data = await this.getAllFilters(supabase);

        return {
            categories: data.filter(f => f.category?.trim().toLowerCase() === 'group_category'),
            templates: data.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate'),
            themes: data.filter(f => f.category?.trim().toLowerCase() === 'theme'),
            platforms: data.filter(f => f.category?.trim().toLowerCase() === 'plataform_meeting')
        };
    }
};