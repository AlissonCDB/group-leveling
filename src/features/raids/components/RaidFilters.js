import React from 'react';
import { FilterPanel, FilterOptionGroup } from '@/components/UI/FiltersComponents';

export default function RaidFilters({
    timeFilter, setTimeFilter,
    categoryFilter, setCategoryFilter,
    templateFilter, setTemplateFilter,
    platformFilter, setPlatformFilter,
    categories, templates, platforms, // <--- GARANTA QUE ESTAS 3 PALAVRAS ESTÃO AQUI
    loading
}) {
    if (loading) return null;

    // Função auxiliar segura (usa fallback para array vazio caso o servidor demore a responder)
    const mapToOptions = (items) => [
        { value: 'all', label: 'Todas' },
        ...(items || []).map(item => ({ value: item, label: item }))
    ];

    return (
        <FilterPanel 
            title={`Missões ${timeFilter === 'past' ? 'Concluídas' : 'Ativas'}`} 
            subtitle="Sincronizado com o servidor"
        >
            <FilterOptionGroup 
                label="Status das Raids" 
                options={[
                    { value: 'all', label: 'Todas' },
                    { value: 'past', label: 'Finalizadas' },
                    { value: 'upcoming', label: 'Agendadas' }
                ]} 
                activeValue={timeFilter} 
                onChange={setTimeFilter} 
                colorType="blue" 
            />
            
            <FilterOptionGroup 
                label="Categorias das Raids" 
                options={mapToOptions(categories)} 
                activeValue={categoryFilter} 
                onChange={setCategoryFilter} 
                colorType="cyan" 
            />

            <FilterOptionGroup 
                label="Modelos" 
                options={mapToOptions(templates)} 
                activeValue={templateFilter} 
                onChange={setTemplateFilter} 
                colorType="cyan" 
            />

            <FilterOptionGroup 
                label="Plataformas" 
                options={mapToOptions(platforms)} 
                activeValue={platformFilter} 
                onChange={setPlatformFilter} 
                colorType="cyan" 
            />
        </FilterPanel>
    );
}