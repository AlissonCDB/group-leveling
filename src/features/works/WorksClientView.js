'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase } from 'lucide-react';

import Modal from '@/components/UI/Modal';
import ModalTrabalho from '@/features/works/components/ModalTrabalho';
import ModalEdicaoTrabalho from '@/features/works/components/ModalEdicaoTrabalho';
import WorkSidebar from '@/features/works/components/WorkSidebar';
import DynamicFilterPanel from '@/components/Layout/DynamicFilterPanel';
import WorkCard from '@/features/works/components/WorkCard';

// 1. Importamos as nossas novas armas!
import { useWorksFilter } from '@/hooks/useWorksFilter';
import { getWorksFiltersConfig } from '@/constants/filters.constants';

export default function WorksClientView({ initialWorks, currentUserId, workTypes, semester }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [workToEdit, setWorkToEdit] = useState(null);
    const [scrollTop, setScrollTop] = useState(0);

    // 2. O Hook faz TODO o trabalho pesado
    const { filters, updateFilter, filteredAndSortedWorks } = useWorksFilter(initialWorks);

    // 3. Obtemos a configuração de UI passando as opções recebidas do servidor
    const filtersConfig = getWorksFiltersConfig(
        workTypes.map(w => w.option || w),
        semester.map(s => s.option || s)
    );

    const handleScroll = (e) => setScrollTop(e.target.scrollTop);
    const openEditModal = (work) => { setWorkToEdit(work); setIsEditModalOpen(true); };

    const handleDownloadWork = async (work) => {
        if (work.archive) window.open(work.archive, '_blank');
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
                await supabase.from('User_Work').insert([{ id_user: currentUserId, id_work: work.id }]);
            }
        } catch (err) {
            console.error("Erro interno ao processar download:", err.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-950 overflow-y-auto md:overflow-hidden" onScroll={handleScroll}>
            <WorkSidebar onOpenCreateModal={() => setIsModalOpen(true)} scrollTop={scrollTop} />

            <div className="flex-1 w-full md:w-2/3 flex flex-col p-6 md:p-12 h-max md:h-full overflow-visible md:overflow-y-auto scrollbar-hide mb-25 relative z-0">

                <DynamicFilterPanel
                    title="Arquivos e Trabalhos"
                    subtitle="Acervo académico da Guilda"
                    config={filtersConfig}
                    currentFilters={filters}
                    onFilterChange={updateFilter} // Passamos o updateFilter diretamente!
                />

                {filteredAndSortedWorks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-500/20 rounded-2xl p-10 mt-6">
                        <Briefcase size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhum trabalho encontrado para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-6">
                        {filteredAndSortedWorks.map((work) => (
                            <WorkCard key={work.id} work={work} currentUserId={currentUserId} onEdit={openEditModal} onDownload={() => handleDownloadWork(work)} />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalTrabalho
                    onFinish={() => setIsModalOpen(false)}
                    workTypes={workTypes}
                    semester={semester}
                />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setWorkToEdit(null); }} closeOnOverlayClick={false}>
                {workToEdit && (
                    <ModalEdicaoTrabalho
                        workData={workToEdit}
                        onFinish={() => { setIsEditModalOpen(false); setWorkToEdit(null); }}
                        workTypes={workTypes}
                        semester={semester}
                    />
                )}
            </Modal>
        </div>
    );
}