import React from 'react';
import { Users, ShieldPlus } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';

export default function RaidSidebar({ onOpenCreateModal, scrollTop = 0 }) {
    const maxScroll = 150; 
    const progress = Math.min(scrollTop / maxScroll, 1);

    return (
        <>
            <style>{`
                .dynamic-sidebar {
                    /* A mágica do "Glued Effect". Ele trava quando restam apenas 59px! */
                    position: sticky;
                    top: calc(-40vh + 59px);
                    height: 40vh;
                    z-index: 50;
                }
                
                .dynamic-content-wrapper {
                    /* Fixa o conteúdo na base para ele sempre aparecer nos 59px restantes */
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: calc(16px + (16px * (1 - var(--scroll-progress))));
                }

                .dynamic-text {
                    opacity: calc(1 - var(--scroll-progress));
                    transform: translateY(calc(-20px * var(--scroll-progress)));
                    max-height: calc(200px * (1 - var(--scroll-progress)));
                    margin-bottom: calc(24px * (1 - var(--scroll-progress)));
                    overflow: hidden;
                }
                
                .dynamic-button-container {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    padding: 0 1rem;
                }
                
                .dynamic-spacer-left {
                    flex-grow: calc(1 - var(--scroll-progress)); 
                }
                .dynamic-spacer-right {
                    flex-grow: 1;
                }
                .dynamic-button {
                    margin-left: calc(4rem * var(--scroll-progress)); 
                }
                
                /* Reset para Desktop, garantindo o layout de 2 colunas */
                @media (min-width: 768px) {
                    .dynamic-sidebar {
                        position: relative;
                        top: 0;
                        height: 100vh !important;
                    }
                    .dynamic-content-wrapper {
                        justify-content: center;
                        padding: 2rem !important;
                    }
                    .dynamic-text {
                        opacity: 1 !important;
                        transform: none !important;
                        max-height: 500px !important;
                        margin-bottom: 2rem !important;
                    }
                    .dynamic-spacer-left, .dynamic-spacer-right {
                        display: none !important;
                    }
                    .dynamic-button {
                        margin-left: 0 !important;
                    }
                }
            `}</style>

            <div 
                className="dynamic-sidebar w-full md:w-1/3 bg-purple-700 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:shadow-[10px_0_30px_rgba(0,0,0,0.5)] overflow-hidden shrink-0"
                style={{ '--scroll-progress': progress }}
            >
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />
                
                {/* Repare que empacotamos o conteúdo nesta div alinhada embaixo */}
                <div className="dynamic-content-wrapper z-10 w-full">
                    
                    <div className="hidden w-20 h-20 bg-purple-900/50 rounded-full border-2 border-purple-400 md:flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <Users size={40} className="text-purple-200"/>
                    </div>
                    
                    <div className="dynamic-text flex flex-col items-center w-full px-4 text-center pointer-events-none md:pointer-events-auto">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg whitespace-nowrap">
                            Radar de Raids
                        </h1>
                        <p className="text-sm md:text-base text-purple-200 max-w-xs font-medium leading-relaxed">
                            Acompanhe os próximos grupos de estudo agendados pela guilda. Encontre o seu esquadrão e prepare-se.
                        </p>
                    </div>

                    <div className="dynamic-button-container relative z-20">
                        <div className="dynamic-spacer-left"></div>
                        
                        <div className="dynamic-button shrink-0">
                            <PrimaryButton 
                                onClick={onOpenCreateModal} 
                                style={{ padding: '0.75rem 1.5rem', width: 'auto' }}
                            >
                                <span className="flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                                    <ShieldPlus size={20}/>
                                    AGENDAR NOVA RAID
                                </span>
                            </PrimaryButton>
                        </div>

                        <div className="dynamic-spacer-right"></div>
                    </div>
                </div>
            </div>
        </>
    );
}