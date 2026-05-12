'use client';

import React from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';
import { useRouter } from 'next/navigation';
import BaseSidebar from '@/components/Layout/BaseSidebar';

export default function RankSidebar({ scrollTop }) {
    const router = useRouter();

    return (
        <BaseSidebar 
            scrollTop={scrollTop}
            themeColor="#b45309" /* amber-700 */
            accentColor="#fcd34d" /* amber-300 */
            icon={Trophy}
            title="Ranking"
            description="Acompanhe o seu progresso, compare o seu nível e lute pelo topo da guilda. Mostre a todos quem domina o conhecimento."
            actionButton={
                <PrimaryButton 
                    onClick={() => router.push('/home')} 
                    style={{ padding: '1rem 2rem', width: 'auto', backgroundColor: '#d97706' }}
                >
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        <ArrowLeft size={20} />
                        VOLTAR AO MENU
                    </span>
                </PrimaryButton>
            }
        />
    );
}