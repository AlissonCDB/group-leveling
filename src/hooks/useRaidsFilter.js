// src/hooks/useRaidsFilter.js
import { useState, useMemo } from 'react';
import { DEFAULT_RAID_FILTERS } from '@/constants/filters.constants';

export function useRaidsFilter(initialRaids = []) {
    const [filters, setFilters] = useState(DEFAULT_RAID_FILTERS);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredAndSortedRaids = useMemo(() => {
        const now = new Date();

        return initialRaids
            .filter((raid) => {
                let matchesTemplate = true;
                let matchesCategory = true;
                let matchesPlatform = true;
                let matchesTime = true;

                if (filters.template !== 'all') matchesTemplate = raid.meeting_tamplate?.option === filters.template;
                if (filters.category !== 'all') matchesCategory = raid.group_category?.option === filters.category;
                if (filters.platform !== 'all') matchesPlatform = raid.plataform_meeting?.option === filters.platform;

                const utcDate = new Date(raid.meeting_date);
                const raidDate = new Date(
                    utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(),
                    utcDate.getUTCHours(), utcDate.getUTCMinutes()
                );

                if (filters.time === 'upcoming') matchesTime = raidDate >= now;
                if (filters.time === 'past') matchesTime = raidDate < now;
                // se for 'all', matchesTime continua true

                return matchesTemplate && matchesCategory && matchesPlatform && matchesTime;
            })
            .sort((a, b) => {
                const utcDateA = new Date(a.meeting_date);
                const dateA = new Date(utcDateA.getUTCFullYear(), utcDateA.getUTCMonth(), utcDateA.getUTCDate(), utcDateA.getUTCHours(), utcDateA.getUTCMinutes()).getTime();

                const utcDateB = new Date(b.meeting_date);
                const dateB = new Date(utcDateB.getUTCFullYear(), utcDateB.getUTCMonth(), utcDateB.getUTCDate(), utcDateB.getUTCHours(), utcDateB.getUTCMinutes()).getTime();

                // Passadas: mais recentes primeiro. Futuras: mais próximas primeiro.
                return filters.time === 'past' ? dateB - dateA : dateA - dateB;
            });
    }, [initialRaids, filters]);

    return { 
        filters, 
        updateFilter, 
        filteredAndSortedRaids 
    };
}