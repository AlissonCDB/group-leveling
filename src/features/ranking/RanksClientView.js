'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CalendarPlus } from 'lucide-react'; 
import RankSidebar from '@/features/ranking/components/RankSidebar';
import RankingSection from './components/RankingSection';
import RankingModal from './components/RankingModal';
import { useRanking } from '@/hooks/useRanking';

export default function RanksClientView({ allUsersData, currentUserId }) {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState(null); 
    const [periodFilter, setPeriodFilter] = useState('all'); 
    const [viewMode, setViewMode] = useState('quantidade'); 

    const { worksRanking, meetingsRanking } = useRanking(allUsersData, periodFilter, viewMode);

    const handleProfileNavigation = (id) => router.push(`/profile/${id}`);

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans relative">
            <RankSidebar />
            
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* Cabeçalho e Filtros */}
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
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                        viewMode === mode 
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
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                        periodFilter === filter 
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
                    <RankingSection 
                        title="Top Contribuidores"
                        subtitle={viewMode === 'quantidade' ? 'Baseado em Trabalhos Publicados' : 'Baseado na Qualidade dos Trabalhos'}
                        icon={Briefcase}
                        colorClass="bg-amber-500"
                        data={worksRanking}
                        viewMode={viewMode}
                        labelScore="Pubs"
                        currentUserId={currentUserId}
                        onUserClick={handleProfileNavigation}
                        onShowMore={() => setActiveModal('works')}
                    />

                    <RankingSection 
                        title="Top Organizadores"
                        subtitle={viewMode === 'quantidade' ? 'Baseado em Raids Agendadas' : 'Baseado na Qualidade das Raids'}
                        icon={CalendarPlus}
                        colorClass="bg-blue-500"
                        data={meetingsRanking}
                        viewMode={viewMode}
                        labelScore="Raids"
                        currentUserId={currentUserId}
                        onUserClick={handleProfileNavigation}
                        onShowMore={() => setActiveModal('meetings')}
                    />
                </div>
            </div>

            <RankingModal 
                activeModal={activeModal}
                onClose={() => setActiveModal(null)}
                worksRanking={worksRanking}
                meetingsRanking={meetingsRanking}
                viewMode={viewMode}
                currentUserId={currentUserId}
                onUserClick={handleProfileNavigation}
            />
        </div>
    );
}