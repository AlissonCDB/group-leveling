'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase } from 'lucide-react';
import Modal from '@/components/UI/Modal';
import ModalTrabalho from '@/features/works/components/ModalTrabalho';
import ModalEdicaoTrabalho from '@/features/works/components/ModalEdicaoTrabalho';
import WorkSidebar from '@/features/works/components/WorkSidebar';
import WorkFilters from '@/features/works/components/WorkFilters';
import WorkCard from '@/features/works/components/WorkCard';

export default function WorksClientView({ initialWorks, currentUserId }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [workToEdit, setWorkToEdit] = useState(null);


    const [typeFilter, setTypeFilter] = useState('all');
    const [graduationFilter, setGraduationFilter] = useState('all');
    const [scrollTop, setScrollTop] = useState(0);
    const handleScroll = (e) => setScrollTop(e.target.scrollTop);


    const uniqueTypes = Array.from(new Set(initialWorks.map(w => w.type).filter(Boolean)));
    const uniqueGraduations = Array.from(new Set(initialWorks.map(w => w.graduation).filter(Boolean)));

    const openEditModal = (work) => {
        setWorkToEdit(work);
        setIsEditModalOpen(true);
    };


    const handleDownloadWork = async (work) => {
        if (work.archive) {
            window.open(work.archive, '_blank');
        }

        if (!currentUserId || work.user_id === currentUserId) return;

        const supabase = createClient();

        try {
            const { data: existingRecord, error: searchError } = await supabase
                .from('User_Work')
                .select('id')
                .eq('id_user', currentUserId)
                .eq('id_work', work.id)
                .maybeSingle();

            if (searchError) throw searchError;

            if (!existingRecord) {
                const { error: insertError } = await supabase
                    .from('User_Work')
                    .insert([{ id_user: currentUserId, id_work: work.id }]);

                if (insertError) {
                    console.warn("Registro duplicado ou bloqueado pelo banco.");
                } else {
                    console.log("Novo trabalho adicionado à sua biblioteca!");
                }
            } else {
                console.log("Este trabalho já consta na sua biblioteca.");
            }
        } catch (err) {
            console.error("Erro interno ao processar download:", err.message);
        }
    };


    const filteredWorks = initialWorks.filter((work) => {
        let matchesType = true;
        let matchesGraduation = true;

        if (typeFilter !== 'all') matchesType = work.type === typeFilter;
        if (graduationFilter !== 'all') matchesGraduation = work.graduation === graduationFilter;

        return matchesType && matchesGraduation;
    });

    return (
        <div 
    className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 overflow-y-auto md:overflow-hidden"
    onScroll={handleScroll}
  >

            {/* Painel Esquerdo */}
            <WorkSidebar onOpenCreateModal={() => setIsModalOpen(true)} scrollTop={scrollTop} />

            <div className="flex-1 w-full md:w-2/3 flex flex-col p-6 md:p-12 h-max md:h-full overflow-visible md:overflow-y-auto scrollbar-hide mb-25 relative z-0">

                {/* Cabeçalho com Filtros */}
                <WorkFilters
                    typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                    graduationFilter={graduationFilter} setGraduationFilter={setGraduationFilter}
                    uniqueTypes={uniqueTypes} uniqueGraduations={uniqueGraduations}
                    loading={false}
                />

                {/* RENDERIZAÇÃO DA LISTA */}
                {filteredWorks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10 mt-6">
                        <Briefcase size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhum trabalho encontrado para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-6">
                        {filteredWorks.map((work) => (
                            <WorkCard
                                key={work.id}
                                work={work}
                                currentUserId={currentUserId}
                                onEdit={openEditModal}
                                onDownload={() => handleDownloadWork(work)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODAIS */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalTrabalho onFinish={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setWorkToEdit(null); }} closeOnOverlayClick={false}>
                {workToEdit && (
                    <ModalEdicaoTrabalho
                        workData={workToEdit}
                        onFinish={() => { setIsEditModalOpen(false); setWorkToEdit(null); }}
                    />
                )}
            </Modal>
        </div>
    );
}