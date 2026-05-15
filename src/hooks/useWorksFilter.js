// src/hooks/useWorksFilter.js
import { useState, useMemo } from 'react';
import { DEFAULT_WORK_FILTERS } from '@/constants/filters.constants';

export function useWorksFilter(initialWorks = []) {
    // Inicializa o estado com as constantes
    const [filters, setFilters] = useState(DEFAULT_WORK_FILTERS);

    // Função genérica para atualizar qualquer filtro
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Memoização: Só recalcula se a lista original ou os filtros mudarem
    const filteredAndSortedWorks = useMemo(() => {
        return initialWorks
            .filter((work) => {
                const matchesType = filters.type === 'all' || work.type === filters.type;
                const matchesSemester = filters.semester === 'all' || work.graduation === filters.semester;

                return matchesType && matchesSemester;
            })
            .sort((a, b) => {
                if (filters.time === 'oldest') return a.id - b.id;
                return b.id - a.id; // newest (padrão)
            });
    }, [initialWorks, filters]);

    return { 
        filters, 
        updateFilter, 
        filteredAndSortedWorks 
    };
}