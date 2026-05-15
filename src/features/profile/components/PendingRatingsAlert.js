'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

export default function PendingRatingsAlert({ pendingTotal }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hasSeenAlert = sessionStorage.getItem('hasSeenRatingAlert');
        
        // Se houver pendências e o alerta ainda não foi mostrado nesta sessão
        if (pendingTotal > 0 && !hasSeenAlert) {
            setIsOpen(true);
            
            // Mesmo que ele saia da página sem clicar em nada, não aparecerá mais.
            sessionStorage.setItem('hasSeenRatingAlert', 'true');
        }
    }, [pendingTotal]);

    const closeAlert = (path = null) => {
        setIsOpen(false);
        if (path) router.push(path);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-9999 w-[320px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="bg-gray-950 border border-amber-500/30 rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.2)] overflow-hidden relative">
                
                <button onClick={() => closeAlert()} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors">
                    <X size={16} />
                </button>

                <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 shrink-0 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                            <AlertCircle size={20} className="text-amber-500" />
                        </div>
                        <div className="pr-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-tight mb-1">Feedback Pendente</h3>
                            <p className="text-xs text-gray-400">
                                <strong className="text-amber-400">{pendingTotal}</strong> {pendingTotal === 1 ? 'atividade aguarda' : 'atividades aguardam'} a sua nota.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => closeAlert()} className="flex-1 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg font-bold uppercase text-[9px] tracking-widest transition-all">
                            Depois
                        </button>
                        <button onClick={() => closeAlert('/profile')} className="flex-2 flex items-center justify-center gap-1.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-black uppercase text-[9px] tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            Avaliar Agora <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}