'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Star, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export default function PendingRatingsAlert() {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // 🔴 MODO DEBUG: Comentámos a verificação da sessão para ele testar SEMPRE.
        // const hasSeenAlert = sessionStorage.getItem('hasSeenRatingAlert');
        // if (hasSeenAlert) return;

        async function checkPendingRatings() {
            console.log("🔍 ALERTA: Iniciando verificação de pendências...");
            const supabase = createClient();
            
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                console.log("❌ ALERTA: Utilizador não autenticado no Supabase.");
                return;
            }

            const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
            if (!userData) return;
            
            const userId = userData.id;
            const now = new Date();
            console.log("👤 ALERTA: Utilizador logado ID:", userId);

            let totalPending = 0;

            try {
                // 1. Busca Raids participadas SEM NOTA
                const { data: pendingRaids, error: errorRaids } = await supabase
                    .from('User_Meeting')
                    .select('id, Meeting!inner(meeting_date, creator)')
                    .eq('id_user', userId)
                    .is('rating', null);

                if (errorRaids) console.error("Erro Raids:", errorRaids);

                const validPendingRaids = (pendingRaids || []).filter(pr => {
                    if (!pr.Meeting) return false;
                    
                    const utcDate = new Date(pr.Meeting.meeting_date);
                    const raidDate = new Date(
                        utcDate.getUTCFullYear(),
                        utcDate.getUTCMonth(),
                        utcDate.getUTCDate(),
                        utcDate.getUTCHours(),
                        utcDate.getUTCMinutes()
                    );
                    
                    const isPast = raidDate < now;
                    const notCreator = pr.Meeting.creator !== userId;
                    return isPast && notCreator;
                });
                
                console.log(`⚔️ ALERTA: Raids pendentes encontradas válidas: ${validPendingRaids.length}`, validPendingRaids);

                // 2. Busca Trabalhos acessados SEM NOTA
                const { data: pendingWorks, error: errorWorks } = await supabase
                    .from('User_Work')
                    .select('id, Work!inner(user_id)')
                    .eq('id_user', userId)
                    .is('rating', null);

                if (errorWorks) console.error("Erro Works:", errorWorks);

                const validPendingWorks = (pendingWorks || []).filter(pw => {
                    return pw.Work && pw.Work.user_id !== userId;
                });

                console.log(`📚 ALERTA: Trabalhos pendentes encontrados válidos: ${validPendingWorks.length}`, validPendingWorks);

                totalPending = validPendingRaids.length + validPendingWorks.length;
                console.log(`✅ ALERTA: TOTAL DE PENDÊNCIAS = ${totalPending}`);

                // Se houver pendências, abre o modal!
                if (totalPending > 0) {
                    setPendingCount(totalPending);
                    setIsOpen(true);
                }

            } catch (error) {
                console.error("Erro ao checar avaliações pendentes:", error);
            }
        }

        checkPendingRatings();
    }, []);

    const handleEvaluateLater = () => {
        // sessionStorage.setItem('hasSeenRatingAlert', 'true');
        setIsOpen(false);
    };

    const handleEvaluateNow = () => {
        // sessionStorage.setItem('hasSeenRatingAlert', 'true');
        setIsOpen(false);
        router.push('/profile'); 
    };

    if (!isOpen) return null;

    return (
        // 🔴 MUDANÇA: Aumentei o z-index de forma absurda (z-[9999]) para garantir que passa por cima de qualquer background do Home
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-950 border border-amber-500/30 rounded-2xl w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
                
                <div className="bg-amber-500/10 p-6 flex flex-col items-center border-b border-amber-500/20">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        <AlertCircle size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest text-center">
                        Avaliações Pendentes
                    </h2>
                </div>
                
                <div className="p-8 flex flex-col items-center text-center">
                    <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                        A guilda precisa do seu feedback! Você tem <strong className="text-amber-400 text-lg">{pendingCount}</strong> {pendingCount === 1 ? 'atividade aguardando' : 'atividades aguardando'} sua nota.
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 mb-8 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                        <Star size={14} className="text-amber-500/50" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Avaliar ajuda a destacar os melhores!</span>
                        <Star size={14} className="text-amber-500/50" />
                    </div>

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