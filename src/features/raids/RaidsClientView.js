'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { MonitorPlay } from 'lucide-react';

import Modal from '@/components/UI/Modal';
import ModalAgendamento from './components/ModalAgendamento';
import ModalEdicaoAgendamento from './components/ModalEdicaoAgendamento';
import RaidSidebar from './components/RaidSidebar';
import RaidFilters from './components/RaidFilters';
import RaidCard from './components/RaidCard';

// GARANTA QUE 'categories' E 'platforms' ESTÃO NESTA LINHA
export default function RaidsClientView({ initialRaids, categories, templates, platforms, currentUserId }) {
    const router = useRouter();

    const [raids, setRaids] = useState(initialRaids);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [raidToEdit, setRaidToEdit] = useState(null);

    // Estados dos Filtros
    const [timeFilter, setTimeFilter] = useState('upcoming');
    const [templateFilter, setTemplateFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all'); 

    const [scrollTop, setScrollTop] = useState(0);

    const openEditModal = (raid) => {
        setRaidToEdit(raid);
        setIsEditModalOpen(true);
    };

    const handleEnterRaid = async (raidOrId) => {
        if (!currentUserId) return;
        const meetingId = typeof raidOrId === 'object' ? (raidOrId.id || raidOrId.id_meeting) : raidOrId;
        if (!meetingId) return;

        const supabase = createClient();
        try {
            const isMember = typeof raidOrId === 'object'
                ? (raidOrId.User_Meeting?.some(m => m.id_user === currentUserId) || raidOrId.creator === currentUserId)
                : false;

            if (!isMember) {
                await meetingService.joinMeeting(supabase, meetingId, currentUserId);
                const raidsData = await meetingService.getAllRaids(supabase);
                setRaids(raidsData || []);
            }
            router.push(`/groups/${meetingId}`);
        } catch (error) {
            console.error("Erro ao processar entrada na raid:", error.message);
        }
    };

    const handleLeaveRaid = async (raidOrId) => {
        if (!currentUserId) return;
        const meetingId = typeof raidOrId === 'object' ? (raidOrId.id || raidOrId.id_meeting) : raidOrId;
        if (!meetingId) return;
        if (!window.confirm("Tem certeza que deseja abandonar esta missão?")) return;

        const supabase = createClient();
        try {
            await meetingService.leaveMeeting(supabase, meetingId, currentUserId);
            const raidsData = await meetingService.getAllRaids(supabase);
            setRaids(raidsData || []);
        } catch (error) {
            console.error("Erro ao sair da raid:", error.message);
        }
    };

    const handleScroll = (e) => setScrollTop(e.target.scrollTop);

    const now = new Date();
    
    // Lógica de Filtragem Segura
    const filteredAndSortedRaids = (raids || [])
        .filter((raid) => {
            let matchesTemplate = true;
            let matchesCategory = true;
            let matchesPlatform = true;
            let matchesTime = true;

            if (templateFilter !== 'all') matchesTemplate = raid.meeting_tamplate?.option === templateFilter;
            if (categoryFilter !== 'all') matchesCategory = raid.group_category?.option === categoryFilter;
            if (platformFilter !== 'all') matchesPlatform = raid.plataform_meeting?.option === platformFilter;

            const utcDate = new Date(raid.meeting_date);
            const raidDate = new Date(
                utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(),
                utcDate.getUTCHours(), utcDate.getUTCMinutes()
            );

            if (timeFilter === 'upcoming') matchesTime = raidDate >= now;
            if (timeFilter === 'past') matchesTime = raidDate < now;

            return matchesTemplate && matchesCategory && matchesPlatform && matchesTime;
        })
        .sort((a, b) => {
            const utcDateA = new Date(a.meeting_date);
            const dateA = new Date(utcDateA.getUTCFullYear(), utcDateA.getUTCMonth(), utcDateA.getUTCDate(), utcDateA.getUTCHours(), utcDateA.getUTCMinutes()).getTime();

            const utcDateB = new Date(b.meeting_date);
            const dateB = new Date(utcDateB.getUTCFullYear(), utcDateB.getUTCMonth(), utcDateB.getUTCDate(), utcDateB.getUTCHours(), utcDateB.getUTCMinutes()).getTime();

            return timeFilter === 'past' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 font-sans overflow-y-auto overflow-x-hidden md:overflow-hidden" onScroll={handleScroll}>
            <RaidSidebar onOpenCreateModal={() => setIsModalOpen(true)} scrollTop={scrollTop} />

            <div className="flex-1 w-full md:w-2/3 flex flex-col p-6 md:p-12 h-max md:h-full overflow-visible md:overflow-y-auto scrollbar-hide mb-25 relative z-0" onScroll={handleScroll}>
                
                <RaidFilters
                    timeFilter={timeFilter} setTimeFilter={setTimeFilter}
                    categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                    templateFilter={templateFilter} setTemplateFilter={setTemplateFilter}
                    platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
                    categories={categories} templates={templates} platforms={platforms} // <--- PASSANDO OS DADOS AQUI
                    loading={false}
                />

                {filteredAndSortedRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10 mt-6">
                        <MonitorPlay size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada com estes filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-6">
                        {filteredAndSortedRaids.map((raid) => (
                            <RaidCard
                                key={raid.id}
                                raid={raid}
                                currentUserId={currentUserId}
                                onEdit={openEditModal}
                                onEnter={() => handleEnterRaid(raid)}
                                onLeave={() => handleLeaveRaid(raid)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalAgendamento onFinish={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setRaidToEdit(null); }} closeOnOverlayClick={false}>
                {raidToEdit && <ModalEdicaoAgendamento raidData={raidToEdit} onFinish={() => { setIsEditModalOpen(false); setRaidToEdit(null); }} />}
            </Modal>
        </div>
    );
}