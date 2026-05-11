'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase } from 'lucide-react'; 

// Importando componentes de UI e Modais (ajuste os caminhos se tiver mudado)
import Modal from '@/components/UI/Modal';
import ModalTrabalho from '@/app/(dashboards)/works/ModalTrabalho'; 
import ModalEdicaoTrabalho from '@/app/(dashboards)/works/ModalEdicaoTrabalho';

import WorkSidebar from '@/features/works/components/WorkSidebar';
import WorkFilters from '@/features/works/components/WorkFilters';
import WorkCard from '@/features/works/components/WorkCard';

export default function WorksClientView({ initialWorks, currentUserId }) {
    // 🔴 Removemos o useEffect e o loading! Usamos diretamente initialWorks recebido do Server.
    
    // Controlo de Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [workToEdit, setWorkToEdit] = useState(null);
    
    // Estados de Filtro
    const [typeFilter, setTypeFilter] = useState('all'); 
    const [graduationFilter, setGraduationFilter] = useState('all'); 

    // Extrai categorias únicas diretamente dos dados recebidos
    const uniqueTypes = Array.from(new Set(initialWorks.map(w => w.type).filter(Boolean)));
    const uniqueGraduations = Array.from(new Set(initialWorks.map(w => w.graduation).filter(Boolean)));

    const openEditModal = (work) => {
        setWorkToEdit(work);
        setIsEditModalOpen(true);
    };

    // Lógica para registrar o acesso ao trabalho (mantida intacta)
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

    // Aplicação dos Filtros em cima do initialWorks
    const filteredWorks = initialWorks.filter((work) => {
        let matchesType = true;
        let matchesGraduation = true;

        if (typeFilter !== 'all') matchesType = work.type === typeFilter;
        if (graduationFilter !== 'all') matchesGraduation = work.graduation === graduationFilter;

        return matchesType && matchesGraduation;
    });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* Painel Esquerdo */}
            <WorkSidebar onOpenCreateModal={() => setIsModalOpen(true)} />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* Cabeçalho com Filtros */}
                <WorkFilters 
                    typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                    graduationFilter={graduationFilter} setGraduationFilter={setGraduationFilter}
                    uniqueTypes={uniqueTypes} uniqueGraduations={uniqueGraduations} 
                    loading={false} // Removido o estado de loading
                />

                {/* RENDERIZAÇÃO DA LISTA */}
                {filteredWorks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-500/20 rounded-2xl p-10">
                        <Briefcase size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhum trabalho encontrado para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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