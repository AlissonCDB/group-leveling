'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { MonitorPlay } from 'lucide-react'; 

import Modal from '@/components/UI/Modal';
import ModalAgendamento from '@/app/(dashboards)/groups/ModalAgendamento';
import ModalEdicaoAgendamento from '@/app/(dashboards)/groups/ModalEdicaoAgendamento';

// Importação dos Componentes
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

    //Função para redirecionar para a sala da Raid
    const handleEnterRaid = (raidId) => {
        router.push(`/groups/${raidId}`);
    };

    const now = new Date();
    const filteredAndSortedRaids = raids
        .filter((raid) => {
            let matchesTemplate = true;
            let matchesCategory = true;
            let matchesTime = true;

            if (templateFilter !== 'all') matchesTemplate = raid.meeting_tamplate?.option === templateFilter;
            if (categoryFilter !== 'all') matchesCategory = raid.group_category?.option === categoryFilter;

            const raidDate = new Date(raid.meeting_date);
            if (timeFilter === 'upcoming') matchesTime = raidDate >= now;
            if (timeFilter === 'past') matchesTime = raidDate < now;

            return matchesTemplate && matchesCategory && matchesTime;
        })
        .sort((a, b) => {
            const dateA = new Date(a.meeting_date).getTime();
            const dateB = new Date(b.meeting_date).getTime();
            if (timeFilter === 'past') return dateB - dateA; 
            return dateA - dateB; 
        });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* COMPONENTE: Painel Esquerdo */}
            <RaidSidebar onOpenCreateModal={() => setIsModalOpen(true)} />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* COMPONENTE: Cabeçalho com Filtros */}
                <RaidFilters 
                    timeFilter={timeFilter} setTimeFilter={setTimeFilter}
                    categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                    templateFilter={templateFilter} setTemplateFilter={setTemplateFilter}
                    categories={categories} templates={templates} loading={loading}
                />

                {/* RENDERIZAÇÃO DA LISTA */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-purple-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">A Escanear Raids...</p>
                    </div>
                ) : filteredAndSortedRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10">
                        <MonitorPlay size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredAndSortedRaids.map((raid) => (
                            /* COMPONENTE: Cartão de Missão */
                            <RaidCard 
                                key={raid.id} 
                                raid={raid} 
                                currentUserId={currentUserId} 
                                onEdit={openEditModal} 
                                onEnter={() => handleEnterRaid(raid.id)} /* <-- Propriedade adicionada */
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODAIS (Mantidos na página principal pois sobrepõem tudo) */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalAgendamento onFinish={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setRaidToEdit(null); }} closeOnOverlayClick={false}>
                {raidToEdit && <ModalEdicaoAgendamento raidData={raidToEdit} onFinish={() => { setIsEditModalOpen(false); setRaidToEdit(null); }} />}
            </Modal>
        </div>
    );
}