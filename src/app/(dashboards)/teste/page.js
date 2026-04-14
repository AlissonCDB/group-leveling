'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { PrimaryButton } from '@/components/UI/Form';
import { Users, Calendar, Clock, MonitorPlay, ShieldPlus, MapPin, Wifi, Layers } from 'lucide-react'; 

import Modal from '@/components/UI/Modal';
import ModalAgendamento from '@/app/(dashboards)/groups/ModalAgendamento';

export default function GroupsPage() {
    const [raids, setRaids] = useState([]);
    // NOVO ESTADO: Guardar as categorias reais que vêm da tabela Filters
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estados independentes para os filtros
    const [templateFilter, setTemplateFilter] = useState('all'); // 'all', 'remote', 'in_person'
    const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'Estudos', 'Eventos', etc.

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();
            try {
                // 1. Carrega as Raids Ativas
                const raidsData = await meetingService.getActiveRaids(supabase);
                setRaids(raidsData || []);

                // 2. Carrega as Categorias diretamente da tabela Filters
                const { data: filtersData } = await supabase.from('Filters').select('*');
                if (filtersData) {
                    const groupCategories = filtersData
                        .filter(f => f.category?.trim().toLowerCase() === 'group_category')
                        .map(f => f.option); // Guarda apenas os nomes (ex: 'Estudos', 'Eventos')
                    
                    setCategories(groupCategories);
                }

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [isModalOpen]); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Aplica a combinação dos dois filtros
    const filteredRaids = raids.filter((raid) => {
        let matchesTemplate = true;
        let matchesCategory = true;

        // Filtro de Tipo (Presencial/Remoto)
        if (templateFilter !== 'all') {
            const templateOption = raid.meeting_tamplate?.option?.toLowerCase() || '';
            if (templateFilter === 'in_person') matchesTemplate = templateOption.includes('presencial');
            if (templateFilter === 'remote') matchesTemplate = templateOption.includes('remoto') || templateOption.includes('online');
        }

        // Filtro de Categoria (Estudos, Eventos...)
        if (categoryFilter !== 'all') {
            matchesCategory = raid.group_category?.option === categoryFilter;
        }
        
        return matchesTemplate && matchesCategory;
    });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* Lado Esquerdo - Info e Botão */}
            <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-purple-700 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-purple-900/50 rounded-full border-2 border-purple-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <Users size={40} className="text-purple-200" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                        Radar de Raids
                    </h1>
                    <p className="text-sm md:text-base text-purple-200 text-center max-w-xs font-medium leading-relaxed mb-8">
                        Acompanhe os próximos grupos de estudo agendados pela guilda. Encontre o seu esquadrão, conecte-se na plataforma e prepare-se para farmar conhecimento.
                    </p>

                    <PrimaryButton onClick={openModal} style={{ padding: '1rem 2rem', width: 'auto' }}>
                        <span className="flex items-center gap-2 text-sm md:text-base">
                            <ShieldPlus size={20} />
                            AGENDAR NOVA RAID
                        </span>
                    </PrimaryButton>
                </div>
            </div>

            {/* Lado Direito - Listagem e Filtros */}
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                <div className="mb-8 border-b border-purple-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                            Missões Ativas
                        </h2>
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">
                            Sincronizado com o servidor
                        </p>
                    </div>

                    {/* GRUPO DE FILTROS */}
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        
                        {/* Filtro 1: Categoria (Mostra TODAS as opções da tabela Filters) */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap bg-gray-900 p-1 rounded-xl border border-amber-500/20 gap-1 justify-end">
                                <button 
                                    onClick={() => setCategoryFilter('all')}
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${categoryFilter === 'all' ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    Tudo
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${categoryFilter === cat ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Filtro 2: Presencial / Remoto */}
                        <div className="flex bg-gray-900 p-1 rounded-xl border border-purple-500/20 justify-end">
                            <button 
                                onClick={() => setTemplateFilter('all')}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${templateFilter === 'all' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                                Ambos
                            </button>
                            <button 
                                onClick={() => setTemplateFilter('remote')}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 ${templateFilter === 'remote' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                                <Wifi size={10} /> Remoto
                            </button>
                            <button 
                                onClick={() => setTemplateFilter('in_person')}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 ${templateFilter === 'in_person' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                                <MapPin size={10} /> Presencial
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-purple-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">
                            A Escanear Raids Ativas...
                        </p>
                    </div>
                ) : filteredRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10">
                        <MonitorPlay size={48} className="text-gray-700 mb-4" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada para esta combinação de filtros.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRaids.map((raid) => {
                            const templateName = raid.meeting_tamplate?.option || 'Indefinido';
                            const isPresencial = templateName.toLowerCase().includes('presencial');
                            const platformName = raid.plataform_meeting?.option || 'Plataforma Não Informada';
                            const categoryName = raid.group_category?.option || 'Geral';
                            
                            // O tema principal
                            const cardTitle = raid.theme?.option || 'Sem Tema';

                            return (
                                <div
                                    key={raid.id}
                                    className="relative flex flex-col justify-between p-6 bg-gray-900 border border-purple-500/30 rounded-2xl group hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4 gap-2">
                                            
                                            {/* Título Principal do Card */}
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                                                {cardTitle}
                                            </h4>
                                            
                                            {/* Area de TAGS */}
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                
                                                {/* TAG: Categoria do Grupo (Amarela/Âmbar) */}
                                                <span className="px-2 py-1 bg-amber-900/30 text-[9px] text-amber-400 font-bold rounded border border-amber-500/30 uppercase flex items-center gap-1">
                                                    <Layers size={10} /> {categoryName}
                                                </span>

                                                {/* TAG: Tipo (Presencial/Remoto) */}
                                                {isPresencial ? (
                                                    <span className="px-2 py-1 bg-emerald-900/30 text-[9px] text-emerald-400 font-bold rounded border border-emerald-500/30 uppercase flex items-center gap-1">
                                                        <MapPin size={10} /> {templateName}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-blue-900/30 text-[9px] text-blue-400 font-bold rounded border border-blue-500/30 uppercase flex items-center gap-1">
                                                        <Wifi size={10} /> {templateName}
                                                    </span>
                                                )}
                                                
                                                {/* TAG: Plataforma/Local */}
                                                <span className="px-2 py-1 bg-purple-900/30 text-[9px] text-purple-300 font-bold rounded border border-purple-500/30 uppercase flex items-center gap-1">
                                                    <MonitorPlay size={10} /> {platformName}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 italic mb-4 line-clamp-3 leading-relaxed border-l-2 border-purple-500/30 pl-3">
                                            "{raid.content}"
                                        </p>

                                        {/* ENDEREÇO OU LINK DA REUNIÃO */}
                                        {raid.adress && (
                                            <div className="mb-4 text-xs bg-black/40 p-2 rounded-lg border border-gray-800 break-all">
                                                <span className="text-purple-400 font-bold mr-1">{isPresencial ? '📍 Local:' : '🔗 Link:'}</span> 
                                                <span className="text-gray-300">{raid.adress}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-gray-300 text-xs font-medium bg-gray-950 p-3 rounded-lg border border-gray-800">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-purple-500" />
                                                <span>{new Date(raid.meeting_date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-purple-500" />
                                                <span>
                                                    {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                                                    <span className="text-gray-500 ml-1">({raid.duration})</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                                    {raid.User?.user_name?.[0].toUpperCase() || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-white font-black uppercase tracking-wider">
                                                        {raid.User?.user_name || 'Desconhecido'}
                                                    </span>
                                                    <span className="text-[10px] text-purple-400 font-bold uppercase">Líder</span>
                                                </div>
                                            </div>
                                            
                                            <PrimaryButton 
                                                style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '10px' }}
                                                onClick={() => alert('Entrada em Raid: Implementação em breve!')}
                                            >
                                                Entrar
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} closeOnOverlayClick={false}>
                <ModalAgendamento onFinish={closeModal} />
            </Modal>

        </div>
    );
}