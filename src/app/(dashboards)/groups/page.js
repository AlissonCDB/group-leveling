'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { MonitorPlay } from 'lucide-react';

import Modal from '@/components/UI/Modal';
import ModalAgendamento from '@/app/(dashboards)/groups/ModalAgendamento';
import ModalEdicaoAgendamento from '@/app/(dashboards)/groups/ModalEdicaoAgendamento';

import RaidSidebar from '@/components/View/RaidSidebar';
import RaidFilters from '@/components/View/RaidFilters';
import RaidCard from '@/components/View/RaidCard';

export default function GroupsPage() {
    const router = useRouter();

    const [raids, setRaids] = useState([]);
    const [categories, setCategories] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [raidToEdit, setRaidToEdit] = useState(null);

    const [timeFilter, setTimeFilter] = useState('upcoming');
    const [templateFilter, setTemplateFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
                    if (userData) setCurrentUserId(userData.id);
                }

                const raidsData = await meetingService.getAllRaids(supabase);
                setRaids(raidsData || []);

                const { data: filtersData } = await supabase.from('Filters').select('*');
                if (filtersData) {
                    setCategories(filtersData.filter(f => f.category?.trim().toLowerCase() === 'group_category').map(f => f.option));
                    setTemplates(filtersData.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate').map(f => f.option));
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [isModalOpen, isEditModalOpen]);

    const openEditModal = (raid) => {
        setRaidToEdit(raid);
        setIsEditModalOpen(true);
    };

    const handleEnterRaid = async (raidOrId) => {
        if (!currentUserId) return;

        // Identifica se recebemos o objeto ou só o ID
        const meetingId = typeof raidOrId === 'object' ? (raidOrId.id || raidOrId.id_meeting) : raidOrId;

        if (!meetingId) {
            console.error("❌ Erro: ID da raid não encontrado.", raidOrId);
            return;
        }

        const supabase = createClient();

        try {
            // Verifica se já é membro (usando o objeto raidOrId se disponível)
            const isMember = typeof raidOrId === 'object'
                ? (raidOrId.User_Meeting?.some(m => m.id_user === currentUserId) || raidOrId.creator === currentUserId)
                : false;

            if (!isMember) {
                await meetingService.joinMeeting(supabase, meetingId, currentUserId);
                
                // Atualiza a lista para o contador subir
                const raidsData = await meetingService.getAllRaids(supabase);
                setRaids(raidsData || []);
            }

            // Redireciona para a página da raid
            router.push(`/groups/${meetingId}`);

        } catch (error) {
            console.error("Erro ao processar entrada na raid:", error.message);
        }
    };

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    const now = new Date();
    const filteredAndSortedRaids = raids
        .filter((raid) => {
            let matchesTemplate = true;
            let matchesCategory = true;
            let matchesTime = true;

            if (templateFilter !== 'all') matchesTemplate = raid.meeting_tamplate?.option === templateFilter;
            if (categoryFilter !== 'all') matchesCategory = raid.group_category?.option === categoryFilter;

            // 🔴 CORREÇÃO DO FUSO HORÁRIO NO FILTRO
            const utcDate = new Date(raid.meeting_date);
            const raidDate = new Date(
                utcDate.getUTCFullYear(),
                utcDate.getUTCMonth(),
                utcDate.getUTCDate(),
                utcDate.getUTCHours(),
                utcDate.getUTCMinutes()
            );

            if (timeFilter === 'upcoming') matchesTime = raidDate >= now;
            if (timeFilter === 'past') matchesTime = raidDate < now;

            return matchesTemplate && matchesCategory && matchesTime;
        })
        .sort((a, b) => {
            // 🔴 CORREÇÃO DO FUSO HORÁRIO NA ORDENAÇÃO
            const utcDateA = new Date(a.meeting_date);
            const dateA = new Date(utcDateA.getUTCFullYear(), utcDateA.getUTCMonth(), utcDateA.getUTCDate(), utcDateA.getUTCHours(), utcDateA.getUTCMinutes()).getTime();
            
            const utcDateB = new Date(b.meeting_date);
            const dateB = new Date(utcDateB.getUTCFullYear(), utcDateB.getUTCMonth(), utcDateB.getUTCDate(), utcDateB.getUTCHours(), utcDateB.getUTCMinutes()).getTime();
            
            return timeFilter === 'past' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div
            className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 font-sans overflow-y-auto overflow-x-hidden md:overflow-hidden"
            onScroll={handleScroll}
        >
            <RaidSidebar onOpenCreateModal={() => setIsModalOpen(true)} scrollTop={scrollTop} />

            <div
                className="flex-1 w-full md:w-2/3 flex flex-col p-6 md:p-12 h-max md:h-full overflow-visible md:overflow-y-auto scrollbar-hide mb-25 relative z-0"
                onScroll={handleScroll}
            >
                <RaidFilters
                    timeFilter={timeFilter} setTimeFilter={setTimeFilter}
                    categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                    templateFilter={templateFilter} setTemplateFilter={setTemplateFilter}
                    categories={categories} templates={templates} loading={loading}
                />
                
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-purple-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">A Escanear Raids...</p>
                    </div>
                ) : filteredAndSortedRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10">
                        <MonitorPlay size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                        {filteredAndSortedRaids.map((raid) => (
                            <RaidCard
                                key={raid.id}
                                raid={raid}
                                currentUserId={currentUserId}
                                onEdit={openEditModal}
                                onEnter={() => handleEnterRaid(raid)} 
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