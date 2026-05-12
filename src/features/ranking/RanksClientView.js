'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CalendarPlus } from 'lucide-react';
import RankSidebar from '@/features/ranking/components/RankSidebar';
import RankingList from '@/features/ranking/components/RankingList';
import RankingModal from '@/features/ranking/components/RankingModal';

export default function RanksClientView({ allUsersData, currentUserId }) {
    const router = useRouter();

    const [activeModal, setActiveModal] = useState(null);
    const [periodFilter, setPeriodFilter] = useState('all');
    const [viewMode, setViewMode] = useState('quantidade');
    const [scrollTop, setScrollTop] = useState(0);
    const handleScroll = (e) => setScrollTop(e.target.scrollTop);

    const handleViewProfile = (userId) => {
        router.push(`/profile/${userId}`);
        setActiveModal(null);
    };

    const worksRanking = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return allUsersData.map(user => {
            let validWorks = user.Work ? user.Work : [];
            if (periodFilter === 'week') validWorks = validWorks.filter(w => new Date(w.created_at) >= sevenDaysAgo);
            else if (periodFilter === 'month') validWorks = validWorks.filter(w => new Date(w.created_at) >= thirtyDaysAgo);

            const score = validWorks.length;
            const level = Math.floor(score / 2) + 1;

            let totalRating = 0;
            let ratingCount = 0;

            validWorks.forEach(work => {
                const evaluations = Array.isArray(work.User_Work) ? work.User_Work : (work.User_Work ? [work.User_Work] : []);
                evaluations.forEach(uw => {
                    if (uw && uw.rating) {
                        totalRating += Number(uw.rating);
                        ratingCount++;
                    }
                });
            });

            const avgRating = ratingCount > 0 ? (totalRating / ratingCount) : 0;

            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                score,
                avgRating: parseFloat(avgRating.toFixed(1)),
                level
            };
        })
        .filter(user => viewMode === 'quantidade' ? user.score > 0 : user.avgRating > 0)
        .sort((a, b) => viewMode === 'quantidade' ? b.score - a.score : b.avgRating - a.avgRating);
    }, [allUsersData, periodFilter, viewMode]);

    const meetingsRanking = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return allUsersData.map(user => {
            let validMeetings = user.Meeting ? user.Meeting : [];
            if (periodFilter === 'week') validMeetings = validMeetings.filter(m => new Date(m.created_at) >= sevenDaysAgo);
            else if (periodFilter === 'month') validMeetings = validMeetings.filter(m => new Date(m.created_at) >= thirtyDaysAgo);

            const score = validMeetings.length;
            const level = Math.floor(score / 2) + 1;

            let totalRating = 0;
            let ratingCount = 0;

            validMeetings.forEach(raid => {
                const evaluations = Array.isArray(raid.User_Meeting) ? raid.User_Meeting : (raid.User_Meeting ? [raid.User_Meeting] : []);
                evaluations.forEach(um => {
                    if (um && um.rating) {
                        totalRating += Number(um.rating);
                        ratingCount++;
                    }
                });
            });

            const avgRating = ratingCount > 0 ? (totalRating / ratingCount) : 0;

            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                score,
                avgRating: parseFloat(avgRating.toFixed(1)),
                level
            };
        })
        .filter(user => viewMode === 'quantidade' ? user.score > 0 : user.avgRating > 0)
        .sort((a, b) => viewMode === 'quantidade' ? b.score - a.score : b.avgRating - a.avgRating);
    }, [allUsersData, periodFilter, viewMode]);

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 overflow-y-auto md:overflow-hidden" onScroll={handleScroll}>
            <RankSidebar scrollTop={scrollTop}/>
            
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">
                        Quadro de <span className="text-amber-500">Líderes</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
                            {['quantidade', 'qualidade'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === mode
                                            ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                            : 'text-gray-500 hover:text-amber-400'
                                        }`}
                                >
                                    Por {mode}
                                </button>
                            ))}
                        </div>

                        <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
                            {['all', 'month', 'week'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setPeriodFilter(filter)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${periodFilter === filter
                                            ? 'bg-gray-700 text-white'
                                            : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {filter === 'all' ? 'Global' : filter === 'month' ? 'Mensal' : 'Semanal'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 pb-12">
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <Briefcase className="text-amber-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-200 tracking-tight">Top Contribuidores</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">
                                    {viewMode === 'quantidade' ? 'Baseado em Trabalhos Publicados' : 'Baseado na Qualidade dos Trabalhos'}
                                </p>
                            </div>
                        </div>
                        
                        <RankingList 
                            rankingData={worksRanking.slice(0, 3)} 
                            emptyMessage={`Nenhum jogador pontuou em ${viewMode} neste período.`} 
                            labelScore="Pubs" 
                            viewMode={viewMode}
                            currentUserId={currentUserId}
                            onUserClick={handleViewProfile}
                        />

                        {worksRanking.length > 3 && (
                            <button onClick={() => setActiveModal('works')} className="w-full mt-4 py-3 border-2 border-dashed border-amber-500/30 text-amber-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-500/10 hover:border-amber-400 transition-all">
                                + Ver ranking completo ({worksRanking.length} membros)
                            </button>
                        )}
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <CalendarPlus className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-200 tracking-tight">Top Organizadores</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">
                                    {viewMode === 'quantidade' ? 'Baseado em Raids Agendadas' : 'Baseado na Qualidade das Raids'}
                                </p>
                            </div>
                        </div>

                        <RankingList 
                            rankingData={meetingsRanking.slice(0, 3)} 
                            emptyMessage={`Nenhum jogador pontuou em ${viewMode} neste período.`} 
                            labelScore="Raids" 
                            viewMode={viewMode}
                            currentUserId={currentUserId}
                            onUserClick={handleViewProfile}
                        />

                        {meetingsRanking.length > 3 && (
                            <button onClick={() => setActiveModal('meetings')} className="w-full mt-4 py-3 border-2 border-dashed border-blue-500/30 text-blue-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500/10 hover:border-blue-400 transition-all">
                                + Ver ranking completo ({meetingsRanking.length} membros)
                            </button>
                        )}
                    </section>
                </div>
            </div>

            <RankingModal 
                activeModal={activeModal} 
                onClose={() => setActiveModal(null)} 
                worksRanking={worksRanking} 
                meetingsRanking={meetingsRanking} 
                viewMode={viewMode} 
                currentUserId={currentUserId} 
                onUserClick={handleViewProfile} 
            />
        </div>
    );
}