import { useMemo } from 'react';

export function useRanking(allUsersData, periodFilter) {
    const globalRanking = useMemo(() => {
        const now = new Date();
        const limits = { week: 7, month: 30 };
        const threshold = limits[periodFilter] ? new Date(now.getTime() - limits[periodFilter] * 24 * 60 * 60 * 1000) : null;

        return allUsersData.map(user => {
            let xp = 0;
            let totalUpvotes = 0;
            let totalDownvotes = 0;
            let actsCount = 0;

            const validWorks = user.Work ? user.Work.filter(w => !threshold || new Date(w.created_at) >= threshold) : [];
            xp += validWorks.length * 50; 
            actsCount += validWorks.length;

            validWorks.forEach(work => {
                const evals = Array.isArray(work.User_Work) ? work.User_Work : (work.User_Work ? [work.User_Work] : []);
                evals.forEach(ev => {
                    if (ev?.rating === 1) { xp += 20; totalUpvotes++; }       
                    else if (ev?.rating === -1) { xp -= 10; totalDownvotes++; } 
                });
            });

            
            const validMeetings = user.Meeting ? user.Meeting.filter(m => !threshold || new Date(m.created_at) >= threshold) : [];
            xp += validMeetings.length * 50; 
            actsCount += validMeetings.length;

            validMeetings.forEach(raid => {
                const evals = Array.isArray(raid.User_Meeting) ? raid.User_Meeting : (raid.User_Meeting ? [raid.User_Meeting] : []);
                evals.forEach(ev => {
                    if (ev?.rating === 1) { xp += 20; totalUpvotes++; }       
                    else if (ev?.rating === -1) { xp -= 10; totalDownvotes++; } 
                });
            });

            // fórmula p calcular aqui
            const calcLevel = Math.floor(Math.log((Math.max(xp, 0) / 2000) + 1) / Math.log(1.1)) + 1;

            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                level: calcLevel,
                score: xp, 
                upvotes: totalUpvotes,
                downvotes: totalDownvotes,
                actsCount
            };
        })
        .filter(u => u.score > 0 || u.actsCount > 0) 
        .sort((a, b) => b.score - a.score || b.actsCount - a.actsCount); 
    }, [allUsersData, periodFilter]);

    return { globalRanking };
}