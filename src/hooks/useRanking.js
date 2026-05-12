import { useMemo } from 'react';

export function useRanking(allUsersData, periodFilter, viewMode) {
    const processRanking = (type, evalKey) => {
        const now = new Date();
        const limits = { week: 7, month: 30 };
        const threshold = limits[periodFilter] ? new Date(now.getTime() - limits[periodFilter] * 24 * 60 * 60 * 1000) : null;

        return allUsersData.map(user => {
            let validItems = user[type] || [];
            if (threshold) validItems = validItems.filter(i => new Date(i.created_at) >= threshold);

            const score = validItems.length;
            let totalRating = 0;
            let ratingCount = 0;

            validItems.forEach(item => {
                const evaluations = Array.isArray(item[evalKey]) ? item[evalKey] : (item[evalKey] ? [item[evalKey]] : []);
                evaluations.forEach(ev => {
                    if (ev?.rating) {
                        totalRating += Number(ev.rating);
                        ratingCount++;
                    }
                });
            });

            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                level: user.level || 1, // Garantindo o dado para o RankingList
                score,
                avgRating: ratingCount > 0 ? parseFloat((totalRating / ratingCount).toFixed(1)) : 0
            };
        })
        .filter(u => viewMode === 'quantidade' ? u.score > 0 : u.avgRating > 0)
        .sort((a, b) => viewMode === 'quantidade' ? (b.score - a.score || b.avgRating - a.avgRating) : (b.avgRating - a.avgRating || b.score - a.score));
    };

    const worksRanking = useMemo(() => processRanking('Work', 'User_Work'), [allUsersData, periodFilter, viewMode]);
    const meetingsRanking = useMemo(() => processRanking('Meeting', 'User_Meeting'), [allUsersData, periodFilter, viewMode]);

    return { worksRanking, meetingsRanking };
}