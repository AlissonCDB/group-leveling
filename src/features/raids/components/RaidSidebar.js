import React from 'react';
import { MonitorPlay, CalendarPlus } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';
import BaseSidebar from '@/components/Layout/BaseSidebar';

export default function RaidSidebar({ onOpenCreateModal, scrollTop = 0 }) {
    const isScrolled = scrollTop > 50;

    return (
        <BaseSidebar 
            themeColor={isScrolled ? "#4c1d95" : "#6b21a8"} 
            accentColor="#c084fc" 
            icon={MonitorPlay}
            title="Missões Ativas"
            description="Junte-se a grupos de estudo, participe em discussões técnicas e partilhe conhecimento com a sua guilda."
            scrollTop={scrollTop}
            actionButton={
                <PrimaryButton onClick={onOpenCreateModal} style={{ padding: '1rem 2rem', width: 'auto', backgroundColor: '#9333ea' }}>
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        <CalendarPlus size={20} />
                        AGENDAR MISSÃO
                    </span>
                </PrimaryButton>
            }
        />
    );
}