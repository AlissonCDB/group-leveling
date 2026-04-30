import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';
import { useRouter } from 'next/navigation';

export default function RankSidebar() {
    const router = useRouter();

    return (
        <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-amber-700 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Ícone e Brilho Âmbar */}
                <div className="w-20 h-20 bg-amber-900/50 rounded-full border-2 border-amber-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                    <Trophy size={40} className="text-amber-200" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                    Ranking
                </h1>
                
                <p className="text-sm md:text-base text-amber-200 text-center max-w-xs font-medium leading-relaxed mb-8">
                    Acompanhe o seu progresso, compare o seu nível e lute pelo topo da guilda. Mostre a todos quem domina o conhecimento.
                </p>

                {/* Botão de Voltar ao Início */}
                <PrimaryButton onClick={() => router.push('/')} style={{ padding: '1rem 2rem', width: 'auto' }}>
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        <ArrowLeft size={20} />
                        VOLTAR AO MENU
                    </span>
                </PrimaryButton>
            </div>
        </div>
    );
}