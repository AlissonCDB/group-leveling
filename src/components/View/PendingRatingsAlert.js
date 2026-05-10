'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Star, AlertCircle, Clock, ArrowRight, Target, BookOpen } from 'lucide-react';

export default function PendingRatingsAlert() {
    const [isOpen, setIsOpen] = useState(false);
    
    // 🔴 NOVOS ESTADOS: Contadores separados
    const [pendingRaids, setPendingRaids] = useState(0);
    const [pendingWorks, setPendingWorks] = useState(0);
    
    const router = useRouter();

    useEffect(() => {
        // Verifica a sessão para não chatear o usuário em todos os cliques
        const hasSeenAlert = sessionStorage.getItem('hasSeenRatingAlert');
        if (hasSeenAlert) return;

        async function checkPendingRatings() {
            const supabase = createClient();
            
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
            if (!userData) return;
            
            const userId = userData.id;
            const now = new Date();

            try {
                // 1. Busca Raids participadas SEM NOTA
                const { data: raidsData } = await supabase
                    .from('User_Meeting')
                    .select('id, Meeting!inner(meeting_date, creator)')
                    .eq('id_user', userId)
                    .is('rating', null);

                const validRaids = (raidsData || []).filter(pr => {
                    if (!pr.Meeting) return false;
                    
                    const utcDate = new Date(pr.Meeting.meeting_date);
                    const raidDate = new Date(
                        utcDate.getUTCFullYear(),
                        utcDate.getUTCMonth(),
                        utcDate.getUTCDate(),
                        utcDate.getUTCHours(),
                        utcDate.getUTCMinutes()
                    );
                    
                    return (raidDate < now) && (pr.Meeting.creator !== userId);
                });

                // 2. Busca Trabalhos acessados SEM NOTA
                const { data: worksData } = await supabase
                    .from('User_Work')
                    .select('id, Work!inner(user_id)')
                    .eq('id_user', userId)
                    .is('rating', null);

                const validWorks = (worksData || []).filter(pw => {
                    return pw.Work && pw.Work.user_id !== userId;
                });

                const rCount = validRaids.length;
                const wCount = validWorks.length;

                // Se houver qualquer pendência, atualiza os estados e abre o modal
                if (rCount > 0 || wCount > 0) {
                    setPendingRaids(rCount);
                    setPendingWorks(wCount);
                    setIsOpen(true);
                }

            } catch (error) {
                console.error("Erro ao checar avaliações pendentes:", error);
            }
        }

        checkPendingRatings();
    }, []);

    const handleEvaluateLater = () => {
        sessionStorage.setItem('hasSeenRatingAlert', 'true');
        setIsOpen(false);
    };

    const handleEvaluateNow = () => {
        sessionStorage.setItem('hasSeenRatingAlert', 'true');
        setIsOpen(false);
        router.push('/profile'); 
    };

    if (!isOpen) return null;

    const total = pendingRaids + pendingWorks;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-950 border border-amber-500/30 rounded-2xl w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
                
                {/* Cabeçalho */}
                <div className="bg-amber-500/10 p-6 flex flex-col items-center border-b border-amber-500/20">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        <AlertCircle size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest text-center">
                        Avaliações Pendentes
                    </h2>
                </div>
                
                {/* Corpo */}
                <div className="p-8 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                        A guilda precisa do seu feedback! Você tem <strong className="text-amber-400 text-lg">{total}</strong> {total === 1 ? 'atividade aguardando' : 'atividades aguardando'} a sua nota.
                    </p>

                    {/* 🔴 MUDANÇA: Caixas de contagem visual */}
                    <div className="flex w-full gap-3 mb-8">
                        {pendingRaids > 0 && (
                            <div className="flex-1 bg-gray-900 border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <Target size={24} className="text-emerald-500 mb-2" />
                                <span className="text-3xl font-black text-white leading-none mb-1">{pendingRaids}</span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{pendingRaids === 1 ? 'Missão' : 'Missões'}</span>
                            </div>
                        )}
                        
                        {pendingWorks > 0 && (
                            <div className="flex-1 bg-gray-900 border border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                <BookOpen size={24} className="text-amber-500 mb-2" />
                                <span className="text-3xl font-black text-white leading-none mb-1">{pendingWorks}</span>
                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">{pendingWorks === 1 ? 'Material' : 'Materiais'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mb-8 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                        <Star size={14} className="text-amber-500/50" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Avaliar ajuda a destacar os melhores!</span>
                        <Star size={14} className="text-amber-500/50" />
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col gap-3 w-full">
                        <button 
                            onClick={handleEvaluateNow}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                        >
                            Realizar Avaliações Agora <ArrowRight size={16} />
                        </button>
                        
                        <button 
                            onClick={handleEvaluateLater}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                        >
                            <Clock size={14} /> Avaliar Mais Tarde
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}