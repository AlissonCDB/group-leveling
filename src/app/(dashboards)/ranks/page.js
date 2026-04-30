'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Trophy, Medal, Award, Briefcase, CalendarPlus } from 'lucide-react'; 

import RankSidebar from '@/components/View/RankSidebar'; 

export default function RankingPage() {
    const router = useRouter();

    const [allUsersData, setAllUsersData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [periodFilter, setPeriodFilter] = useState('all'); 
    
    // Novo estado para alternar entre Trabalhos e Agendamentos
    const [rankingType, setRankingType] = useState('works'); // 'works' | 'meetings'

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

                // Busca os Trabalhos (Work) e os Agendamentos (Meeting) onde ele é o 'creator'
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

    // Processa, filtra e ordena os dados SEMPRE que a aba (rankingType) mudar, sem precisar chamar o banco de novo
    const rankings = useMemo(() => {
        return allUsersData.map(user => {
            const worksCount = user.Work ? user.Work.length : 0;
            // Caso o Supabase exija o nome da Foreign Key, o retorno pode vir aninhado diferente. 
            // Mas por padrão, se só houver uma relação, "Meeting.length" funciona perfeitamente.
            const meetingsCount = user.Meeting ? user.Meeting.length : 0;
            
            // Define qual é a pontuação atual baseada na aba selecionada
            const currentScore = rankingType === 'works' ? worksCount : meetingsCount;
            
            // Cálculo de Level fictício: A cada 2 ações, sobe 1 level (começa no 1)
            const calculatedLevel = Math.floor(currentScore / 2) + 1;

            return {
                id: user.id,
                name: `${user.user_name || ''} ${user.last_name || ''}`.trim(),
                score: currentScore,
                level: calculatedLevel
            };
        })
        .filter(user => user.score > 0) // Esconde quem tem 0 na categoria selecionada
        .sort((a, b) => b.score - a.score) // Ordena do maior pro menor
        .slice(0, 50); // Top 50
    }, [allUsersData, rankingType]);

    const handleViewProfile = (userId) => {
        router.push(`/profile/${userId}`);
    };

    const getRankStyles = (index) => {
        switch (index) {
            case 0: return { color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', icon: <Trophy size={24} className="text-yellow-400" /> }; 
            case 1: return { color: 'text-gray-300', border: 'border-gray-300/50', bg: 'bg-gray-300/10', icon: <Medal size={24} className="text-gray-300" /> }; 
            case 2: return { color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10', icon: <Medal size={24} className="text-orange-400" /> }; 
            default: return { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-gray-900', icon: <Award size={20} className="text-gray-500" /> }; 
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            <RankSidebar />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* CABEÇALHO SUPERIOR */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">
                        Tabela de <span className="text-amber-500">Classificação</span>
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

                {/* ABAS SELETORAS DE TIPO DE RANKING */}
                <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
                    <button 
                        onClick={() => setRankingType('works')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all ${
                            rankingType === 'works' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                            : 'bg-gray-900 text-gray-500 border border-transparent hover:bg-gray-800'
                        }`}
                    >
                        <Briefcase size={18} />
                        Trabalhos
                    </button>

                    <button 
                        onClick={() => setRankingType('meetings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all ${
                            rankingType === 'meetings' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                            : 'bg-gray-900 text-gray-500 border border-transparent hover:bg-gray-800'
                        }`}
                    >
                        <CalendarPlus size={18} />
                        Agendamentos
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-amber-500 animate-pulse uppercase text-sm font-black tracking-[0.3em]">
                            Escanear Registros...
                        </p>
                    </div>
                ) : rankings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-amber-500/20 rounded-2xl p-10">
                        <Trophy size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">
                            Nenhum jogador pontuou na categoria de <span className="font-bold text-gray-400">{rankingType === 'works' ? 'Trabalhos' : 'Agendamentos'}</span>.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pb-8">
                        {/* CABEÇALHO DA TABELA */}
                        <div className="hidden md:flex px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <div className="w-16 text-center">Rank</div>
                            <div className="flex-1">Membro</div>
                            <div className="w-24 text-center">Nível</div>
                            <div className="w-32 text-right">{rankingType === 'works' ? 'Trabalhos' : 'Agendamentos'}</div>
                        </div>

                        {/* LISTA DE JOGADORES */}
                        {rankings.map((user, index) => {
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

                                    {/* LEVEL CALCULADO */}
                                    <div className="w-24 text-center">
                                        <div className="text-sm font-bold text-gray-300">Lvl <span className={rankStyle.color}>{user.level}</span></div>
                                    </div>

                                    {/* CONTAGEM DINÂMICA */}
                                    <div className="w-32 text-right">
                                        <div className="text-sm font-black text-gray-400">
                                            {user.score} <span className="text-[10px] text-gray-600 uppercase">{rankingType === 'works' ? 'Pubs' : 'Raids'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}