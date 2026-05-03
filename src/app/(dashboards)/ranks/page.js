'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Trophy, Medal, Award, Briefcase, CalendarPlus, X } from 'lucide-react'; 

import RankSidebar from '@/components/View/RankSidebar'; 

export default function RankingPage() {
    const router = useRouter();

    const [allUsersData, setAllUsersData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estado para controlar qual modal de ranking completo está aberto: 'works' | 'meetings' | null
    const [activeModal, setActiveModal] = useState(null); 
    const [periodFilter, setPeriodFilter] = useState('all'); 

    useEffect(() => {
        async function loadRankingData() {
            const supabase = createClient();
            setLoading(true);

            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
                    if (userData) setCurrentUserId(userData.id);
                }

                const { data: usersData, error } = await supabase
                    .from('User') 
                    .select(`
                        id, 
                        user_name, 
                        last_name,
                        Work ( id ),
                        Meeting ( id )
                    `); 

                if (error) throw error;
                
                setAllUsersData(usersData || []);
            } catch (err) {
                console.error("Detalhes do Erro Supabase:", err);
            } finally {
                setLoading(false);
            }
        }
        
        loadRankingData();
    }, [periodFilter]); 

    // 1. Processa o Ranking de TRABALHOS (AGORA SEM CORTE DE QUANTIDADE)
    const worksRanking = useMemo(() => {
        return allUsersData.map(user => {
            const score = user.Work ? user.Work.length : 0;
            const level = Math.floor(score / 2) + 1;
            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                score,
                level
            };
        })
        .filter(user => user.score > 0)
        .sort((a, b) => b.score - a.score); // Sem o .slice(), mantemos a lista inteira
    }, [allUsersData]);

    // 2. Processa o Ranking de AGENDAMENTOS (AGORA SEM CORTE DE QUANTIDADE)
    const meetingsRanking = useMemo(() => {
        return allUsersData.map(user => {
            const score = user.Meeting ? user.Meeting.length : 0;
            const level = Math.floor(score / 2) + 1;
            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                score,
                level
            };
        })
        .filter(user => user.score > 0)
        .sort((a, b) => b.score - a.score);
    }, [allUsersData]);

    const handleViewProfile = (userId) => {
        router.push(`/profile/${userId}`);
        // Opcional: fechar o modal ao navegar para o perfil
        setActiveModal(null);
    };

    const getRankStyles = (index) => {
        switch (index) {
            case 0: return { color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', icon: <Trophy size={24} className="text-yellow-400" /> }; 
            case 1: return { color: 'text-gray-300', border: 'border-gray-300/50', bg: 'bg-gray-300/10', icon: <Medal size={24} className="text-gray-300" /> }; 
            case 2: return { color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10', icon: <Medal size={24} className="text-orange-400" /> }; 
            default: return { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-gray-900', icon: <Award size={20} className="text-gray-500" /> }; 
        }
    };

    // Função de renderização da lista (usada tanto na tela principal quanto no modal)
    const renderRankingList = (rankingData, emptyMessage, labelScore) => {
        if (rankingData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-800 rounded-2xl p-8 my-4">
                    <Trophy size={40} className="text-gray-700 mb-3 opacity-50" />
                    <p className="text-gray-500 italic text-sm">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                <div className="hidden md:flex px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <div className="w-16 text-center">Rank</div>
                    <div className="flex-1">Membro</div>
                    <div className="w-24 text-center">Nível</div>
                    <div className="w-32 text-right">{labelScore}</div>
                </div>

                {rankingData.map((user, index) => {
                    const rankStyle = getRankStyles(index);
                    const isMe = currentUserId === user.id;

                    return (
                        <div 
                            key={user.id} 
                            onClick={() => handleViewProfile(user.id)}
                            className={`flex items-center p-4 rounded-xl border ${rankStyle.border} ${rankStyle.bg} hover:bg-gray-800 transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            {isMe && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />}

                            <div className="w-16 flex justify-center items-center font-black text-xl">
                                {index < 3 ? rankStyle.icon : <span className="text-gray-600">#{index + 1}</span>}
                            </div>

                            <div className="flex-1 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                                    <span className={`font-bold ${rankStyle.color}`}>
                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className={`font-bold text-base ${isMe ? 'text-amber-400' : 'text-gray-200'}`}>
                                        {user.name || 'Usuário Desconhecido'} {isMe && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2 uppercase">Você</span>}
                                    </h3>
                                </div>
                            </div>

                            <div className="w-24 text-center">
                                <div className="text-sm font-bold text-gray-300">Lvl <span className={rankStyle.color}>{user.level}</span></div>
                            </div>

                            <div className="w-32 text-right">
                                <div className="text-sm font-black text-gray-400">
                                    {user.score} <span className="text-[10px] text-gray-600 uppercase ml-1">{labelScore}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans relative">
            
            <RankSidebar />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">
                        Quadro de <span className="text-amber-500">Líderes</span>
                    </h1>
                    
                    <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
                        {['all', 'month', 'week'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setPeriodFilter(filter)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                    periodFilter === filter 
                                    ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                                    : 'text-gray-500 hover:text-amber-400'
                                }`}
                            >
                                {filter === 'all' ? 'Global' : filter === 'month' ? 'Mensal' : 'Semanal'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-amber-500 animate-pulse uppercase text-sm font-black tracking-[0.3em]">
                            Escanear Registros...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 pb-12">
                        
                        {/* SEÇÃO 1: TRABALHOS (Exibe apenas Top 3) */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                    <Briefcase className="text-amber-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-200 tracking-tight">Top Contribuidores</h2>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Baseado em Trabalhos Publicados</p>
                                </div>
                            </div>
                            
                            {/* Pega apenas do índice 0 até o 3 para a tela principal */}
                            {renderRankingList(worksRanking.slice(0, 3), "Nenhum jogador publicou trabalhos.", "Pubs")}

                            {/* Botão para abrir o Modal de Trabalhos */}
                            {worksRanking.length > 3 && (
                                <button 
                                    onClick={() => setActiveModal('works')}
                                    className="w-full mt-4 py-3 border-2 border-dashed border-amber-500/30 text-amber-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-500/10 hover:border-amber-400 transition-all"
                                >
                                    + Ver ranking completo ({worksRanking.length} membros)
                                </button>
                            )}
                        </section>

                        {/* SEÇÃO 2: AGENDAMENTOS (Exibe apenas Top 3) */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <CalendarPlus className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-200 tracking-tight">Top Organizadores</h2>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Baseado em Raids Agendadas</p>
                                </div>
                            </div>
                            
                            {/* Pega apenas do índice 0 até o 3 para a tela principal */}
                            {renderRankingList(meetingsRanking.slice(0, 3), "Nenhum jogador agendou missões.", "Raids")}

                            {/* Botão para abrir o Modal de Agendamentos */}
                            {meetingsRanking.length > 3 && (
                                <button 
                                    onClick={() => setActiveModal('meetings')}
                                    className="w-full mt-4 py-3 border-2 border-dashed border-blue-500/30 text-blue-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500/10 hover:border-blue-400 transition-all"
                                >
                                    + Ver ranking completo ({meetingsRanking.length} membros)
                                </button>
                            )}
                        </section>

                    </div>
                )}
            </div>

            {/* MODAL DE RANKING COMPLETO */}
           {/* MODAL DE RANKING COMPLETO */}
            {activeModal && (() => {
                // Descobre qual lista estamos exibindo no momento
                const activeRankingList = activeModal === 'works' ? worksRanking : meetingsRanking;
                const labelScore = activeModal === 'works' ? 'Pubs' : 'Raids';
                
                // Encontra a posição do usuário logado na lista
                const myRankIndex = activeRankingList.findIndex(u => u.id === currentUserId);
                const myRankData = myRankIndex !== -1 ? activeRankingList[myRankIndex] : null;

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        {/* Container Principal do Modal com flex-col para separar Header, Corpo e Rodapé */}
                        <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden">
                            
                            {/* 1. Header do Modal (Fixo no Topo) */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 shrink-0">
                                <div className="flex items-center gap-3">
                                    {activeModal === 'works' ? (
                                        <Briefcase className="text-amber-400" size={28} />
                                    ) : (
                                        <CalendarPlus className="text-blue-400" size={28} />
                                    )}
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-widest">
                                            Ranking <span className={activeModal === 'works' ? 'text-amber-500' : 'text-blue-500'}>Completo</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                                            {activeModal === 'works' ? 'Todos os contribuintes de trabalhos' : 'Todos os organizadores de raids'}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* 2. Corpo do Modal (Área Rolável) */}
                            <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
                                {activeModal === 'works'
                                    ? renderRankingList(worksRanking, "Nenhum jogador publicou trabalhos.", "Pubs")
                                    : renderRankingList(meetingsRanking, "Nenhum jogador agendou missões.", "Raids")
                                }
                            </div>

                            {/* 3. Rodapé do Modal (Travado na Base com o Seu Rank) */}
                            <div className="bg-gray-900 border-t border-gray-800 p-4 sm:px-6 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-10 relative">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3 pl-2">
                                    Sua Posição Atual
                                </p>
                                
                                {myRankData ? (
                                    <div className="flex items-center p-3 rounded-xl border border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                        
                                        <div className="w-16 flex justify-center items-center font-black text-xl">
                                            {myRankIndex < 3 ? getRankStyles(myRankIndex).icon : <span className="text-amber-500">#{myRankIndex + 1}</span>}
                                        </div>

                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                                                <span className="font-bold text-amber-400">
                                                    {myRankData.name?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-amber-400">
                                                    {myRankData.name || 'Você'} <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2 uppercase">Você</span>
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="w-24 text-center">
                                            <div className="text-sm font-bold text-gray-300">Lvl <span className="text-amber-400">{myRankData.level}</span></div>
                                        </div>

                                        <div className="w-32 text-right">
                                            <div className="text-sm font-black text-amber-400">
                                                {myRankData.score} <span className="text-[10px] text-amber-500 uppercase ml-1">{labelScore}</span>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center p-4 rounded-xl border border-dashed border-gray-700 bg-gray-950">
                                        <p className="text-gray-500 italic text-sm">Você ainda não pontuou e não entrou neste ranking.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}