'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { ratingService } from '@/services/rating.service';
import { MonitorPlay } from 'lucide-react';

// COMPONENTES
import Modal from '@/components/UI/Modal';
import ModalAgendamento from './components/ModalAgendamento';
import ModalEdicaoAgendamento from './components/ModalEdicaoAgendamento';
import RaidSidebar from './components/RaidSidebar';
import RaidCard from './components/RaidCard';
import DynamicFilterPanel from '@/components/Layout/DynamicFilterPanel';
import RatingModal from '@/components/UI/RatingModal';

// HOOKS E CONSTANTES
import { useRaidsFilter } from '@/hooks/useRaidsFilter';
import { getRaidsFiltersConfig } from '@/constants/filters.constants';

export default function RaidsClientView({ initialRaids, categories, templates, platforms, themes, currentUserId }) {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [raidToEdit, setRaidToEdit] = useState(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [ratingModalData, setRatingModalData] = useState(null);

    const { filters, updateFilter, filteredAndSortedRaids } = useRaidsFilter(initialRaids);

    const filtersConfig = getRaidsFiltersConfig(
        categories.map(c => c.option || c),
        templates.map(t => t.option || t),
        platforms.map(p => p.option || p),
        themes.map(th => th.option || th)
    );

    const handleScroll = (e) => setScrollTop(e.target.scrollTop);

    const handleEnterRaid = async (raid) => {
        if (!currentUserId) return;
        const supabase = createClient();
        try {
            const isMember = raid.User_Meeting?.some(m => m.id_user === currentUserId) || raid.creator === currentUserId;
            if (!isMember) {
                await meetingService.joinMeeting(supabase, raid.id, currentUserId);
                router.refresh();
            }
            router.push(`/groups/${raid.id}`);
        } catch (error) {
            console.error("Erro ao entrar na raid:", error.message);
        }
    };

    const handleLeaveRaid = async (raid) => {
        if (!currentUserId) return;
        if (!window.confirm("Abandonar esta missão?")) return;
        const supabase = createClient();
        try {
            await meetingService.leaveMeeting(supabase, raid.id, currentUserId);
            router.refresh();
        } catch (error) {
            console.error("Erro ao sair da raid:", error.message);
        }
    };


    // Função para salvar a avaliação
    const handleRateSubmit = async (selectedVote, ratingComment) => {
        const supabase = createClient();
        try {
            await ratingService.rateRaid(supabase, ratingModalData.user_meeting_id, selectedVote, ratingComment);
            setRatingModalData(null);
            router.refresh();
        } catch (error) {
            console.error("Erro ao avaliar:", error);
            alert("Não foi possível enviar a avaliação.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 font-sans overflow-y-auto md:overflow-hidden" onScroll={handleScroll}>
            <RaidSidebar onOpenCreateModal={() => setIsModalOpen(true)} scrollTop={scrollTop} />

            <div className="flex-1 w-full md:w-2/3 flex flex-col p-6 md:p-12 h-max md:h-full overflow-y-auto scrollbar-hide mb-25 relative z-0">
                <DynamicFilterPanel
                    title={`Missões ${filters.time === 'past' ? 'Concluídas' : 'Ativas'}`}
                    subtitle="Acervo de Raids da Guilda"
                    config={filtersConfig}
                    currentFilters={filters}
                    onFilterChange={updateFilter}
                />

                {filteredAndSortedRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10 mt-6">
                        <MonitorPlay size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-6">
                        {filteredAndSortedRaids.map((raid) => (
                            <RaidCard
                                key={raid.id}
                                raid={raid}
                                currentUserId={currentUserId}
                                onEdit={(r) => { setRaidToEdit(r); setIsEditModalOpen(true); }}
                                onEnter={() => handleEnterRaid(raid)}
                                onLeave={() => handleLeaveRaid(raid)}
                                onRate={(r, userMeeting) => setRatingModalData({
                                    ...r,
                                    user_meeting_id: userMeeting.id,
                                    user_rating: userMeeting.rating,
                                    user_comment: userMeeting.comment
                                })}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalAgendamento
                    onFinish={() => { setIsModalOpen(false); router.refresh(); }}
                    categories={categories} templates={templates} platforms={platforms} themes={themes}
                />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setRaidToEdit(null); }} closeOnOverlayClick={false}>
                {raidToEdit && (
                    <ModalEdicaoAgendamento
                        raidData={raidToEdit}
                        onFinish={() => { setIsEditModalOpen(false); setRaidToEdit(null); router.refresh(); }}
                        categories={categories} templates={templates} platforms={platforms} themes={themes}
                    />
                )}
            </Modal>
            {ratingModalData && (
                <RatingModal
                    modalData={ratingModalData}
                    modalType="raid"
                    onClose={() => setRatingModalData(null)}
                    onSuccess={() => router.refresh()}
                />
            )}
        </div>
    );
}