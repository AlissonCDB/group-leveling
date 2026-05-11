import React from 'react';
import { MonitorPlay, CalendarPlus } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';
import BaseSidebar from '@/components/Layout/BaseSidebar';

export default function RaidSidebar({ onOpenCreateModal, scrollTop = 0 }) {
    // Pequeno detalhe visual: se a página fizer scroll, a barra fica ligeiramente mais escura
    const isScrolled = scrollTop > 50;

    return (
        <BaseSidebar 
            themeColor={isScrolled ? "#4c1d95" : "#6b21a8"} /* purple-900 vs purple-800 */
            accentColor="#c084fc" /* purple-400 */
            icon={MonitorPlay}
            title="Missões Activas"
            description="Junte-se a grupos de estudo, participe em discussões técnicas e partilhe conhecimento com a sua guilda."
            actionButton={
                <PrimaryButton 
                    onClick={onOpenCreateModal} 
                    style={{ padding: '1rem 2rem', width: 'auto', backgroundColor: '#9333ea' }} // purple-600
                >
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        <CalendarPlus size={20} />
                        AGENDAR MISSÃO
                    </span>
                </PrimaryButton>
            }
        />
    );
}