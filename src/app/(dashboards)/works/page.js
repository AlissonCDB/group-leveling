'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { workService } from '@/services/work.service';
import { Briefcase } from 'lucide-react'; 

import Modal from '@/components/UI/Modal';
import ModalTrabalho from './ModalTrabalho'; 
import ModalEdicaoTrabalho from './ModalEdicaoTrabalho';

import WorkSidebar from '@/components/View/WorkSidebar';
import WorkFilters from '@/components/View/WorkFilters';
import WorkCard from '@/components/View/WorkCard';

export default function WorksPage() {
    const [works, setWorks] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Controlo de Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [workToEdit, setWorkToEdit] = useState(null);
    
    // Estados de Filtro
    const [typeFilter, setTypeFilter] = useState('all'); 
    const [graduationFilter, setGraduationFilter] = useState('all'); 

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            try {
                // Identifica o utilizador logado para habilitar o botão de edição
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
                    if (userData) setCurrentUserId(userData.id);
                }

                // Busca os trabalhos usando o serviço
                const worksData = await workService.getAllWorks(supabase);
                setWorks(worksData || []);

            } catch (err) {
                console.error("Erro ao carregar trabalhos:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [isModalOpen, isEditModalOpen]); // Atualiza a lista quando os modais fecham

    // Extrai categorias únicas diretamente dos dados para montar os botões de filtro dinamicamente
    const uniqueTypes = Array.from(new Set(works.map(w => w.type).filter(Boolean)));
    const uniqueGraduations = Array.from(new Set(works.map(w => w.graduation).filter(Boolean)));

    const openEditModal = (work) => {
        setWorkToEdit(work);
        setIsEditModalOpen(true);
    };

    // Aplicação dos Filtros
    const filteredWorks = works.filter((work) => {
        let matchesType = true;
        let matchesGraduation = true;

        if (typeFilter !== 'all') matchesType = work.type === typeFilter;
        if (graduationFilter !== 'all') matchesGraduation = work.graduation === graduationFilter;

        return matchesType && matchesGraduation;
    });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* COMPONENTE: Painel Esquerdo */}
            <WorkSidebar onOpenCreateModal={() => setIsModalOpen(true)} />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* COMPONENTE: Cabeçalho com Filtros */}
                <WorkFilters 
                    typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                    graduationFilter={graduationFilter} setGraduationFilter={setGraduationFilter}
                    uniqueTypes={uniqueTypes} uniqueGraduations={uniqueGraduations} loading={loading}
                />

                {/* RENDERIZAÇÃO DA LISTA */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-blue-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">A Carregar Arquivos...</p>
                    </div>
                ) : filteredWorks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-500/20 rounded-2xl p-10">
                        <Briefcase size={48} className="text-gray-700 mb-4 opacity-50" />
                        <p className="text-gray-500 italic">Nenhum trabalho encontrado para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredWorks.map((work) => (
                            /* COMPONENTE: Cartão de Trabalho */
                            <WorkCard 
                                key={work.id} 
                                work={work} 
                                currentUserId={currentUserId} 
                                onEdit={openEditModal} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAIS DE CRIAÇÃO E EDIÇÃO --- */}
            
            {/* Modal de Criação */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnOverlayClick={false}>
                <ModalTrabalho onFinish={() => setIsModalOpen(false)} />
            </Modal>

            {/* Modal de Edição (Só renderiza o conteúdo se houver um trabalho selecionado) */}
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