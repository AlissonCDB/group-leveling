import React from 'react';
import { Briefcase, FilePlus } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';

export default function WorkSidebar({ onOpenCreateModal }) {
    return (
        <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-blue-700 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-900/50 rounded-full border-2 border-blue-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <Briefcase size={40} className="text-blue-200" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                    Central de Trabalhos
                </h1>
                <p className="text-sm md:text-base text-blue-200 text-center max-w-xs font-medium leading-relaxed mb-8">
                    Encontre missões académicas, consulte materiais de estudo e entregue os seus projetos para garantir pontos de XP.
                </p>

                <PrimaryButton 
                    onClick={onOpenCreateModal} 
                    className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    style={{ padding: '1rem 2rem', width: 'auto' }}
                >
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        <FilePlus size={20} />
                        NOVO TRABALHO
                    </span>
                </PrimaryButton>
            </div>
        </div>
    );
}