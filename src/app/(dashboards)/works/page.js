'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { PrimaryButton } from '@/components/UI/Form';
import { Users, Calendar, Clock, MonitorPlay, ShieldPlus, MapPin, Wifi } from 'lucide-react'; 

// Importando o Modal e o formulário de Agendamento
import Modal from '@/components/UI/Modal';
import ModalAgendamento from '@/app/(dashboards)/groups/ModalAgendamento';

export default function AgendamentosPage() {
    const [raids, setRaids] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para controlar a visibilidade do modal de criação
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para o filtro: 'all', 'remote', 'in_person'
    const [filter, setFilter] = useState('all');

    // Busca os agendamentos ao carregar a página
    useEffect(() => {
        async function loadRaids() {
            const supabase = createClient();
            try {
                const data = await meetingService.getActiveRaids(supabase);
                setRaids(data);
            } catch (err) {
                console.error("Erro ao carregar raids:", err);
            } finally {
                setLoading(false);
            }
        }

        loadRaids();
    }, [isModalOpen]); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Lógica de filtragem
    const filteredRaids = raids.filter((raid) => {
        if (filter === 'all') return true;
        if (filter === 'in_person') return raid.in_person_meeting === true;
        if (filter === 'remote') return !raid.in_person_meeting; // falso ou null será considerado remoto
        return true;
    });

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* Seção de Informações (Esquerda no Desktop / Topo no Mobile) */}
            <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-purple-700 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
                {/* Background Decorativo */}
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
                        Acompanhe os próximos grupos de estudo agendados pela guilda. Encontre seu esquadrão, conecte-se na plataforma e prepare-se para farmar conhecimento.
                    </p>

                    {/* Botão de Agendar Nova Raid */}
                    <PrimaryButton 
                        onClick={openModal}
                        style={{ padding: '1rem 2rem', width: 'auto' }}
                    >
                        <span className="flex items-center gap-2 text-sm md:text-base">
                            <ShieldPlus size={20} />
                            AGENDAR NOVA RAID
                        </span>
                    </PrimaryButton>
                </div>
            </div>

            {/* Seção de Agendamentos (Direita no Desktop / Fundo no Mobile) */}
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                <div className="mb-8 border-b border-purple-500/20 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                            Missões Ativas
                        </h2>
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">
                            Sincronizado com o servidor
                        </p>
                    </div>

                    {/* Controles de Filtro */}
                    <div className="flex bg-gray-900 p-1 rounded-xl border border-purple-500/20">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${filter === 'all' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                            Todas
                        </button>
                        <button 
                            onClick={() => setFilter('remote')}
                            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1 ${filter === 'remote' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                            <Wifi size={12} /> Remoto
                        </button>
                        <button 
                            onClick={() => setFilter('in_person')}
                            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1 ${filter === 'in_person' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                            <MapPin size={12} /> Presencial
                        </button>
                    </div>
                </div>

                {/* Lista de Agendamentos */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-purple-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">
                            Escaneando Raids Ativas...
                        </p>
                    </div>
                ) : filteredRaids.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-500/20 rounded-2xl p-10">
                        <MonitorPlay size={48} className="text-gray-700 mb-4" />
                        <p className="text-gray-500 italic">Nenhuma missão encontrada para este filtro.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRaids.map((raid) => (
                            <div
                                key={raid.id}
                                className="relative flex flex-col justify-between p-6 bg-gray-900 border border-purple-500/30 rounded-2xl group hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                                            {raid.discipline}
                                        </h4>
                                        <div className="flex flex-col items-end gap-1">
                                            {/* Tag de Tipo (Presencial/Remoto) */}
                                            {raid.in_person_meeting ? (
                                                <span className="px-2 py-1 bg-emerald-900/30 text-[9px] text-emerald-400 font-bold rounded border border-emerald-500/30 uppercase flex items-center gap-1">
                                                    <MapPin size={10} /> Presencial
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-blue-900/30 text-[9px] text-blue-400 font-bold rounded border border-blue-500/30 uppercase flex items-center gap-1">
                                                    <Wifi size={10} /> Remoto
                                                </span>
                                            )}
                                            
                                            {/* Tag de Plataforma/Local */}
                                            <span className="px-2 py-1 bg-purple-900/30 text-[9px] text-purple-300 font-bold rounded border border-purple-500/30 uppercase flex items-center gap-1">
                                                <MonitorPlay size={10} /> {raid.plataform_meeting}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 italic mb-6 line-clamp-3 leading-relaxed border-l-2 border-purple-500/30 pl-3">
                                        "{raid.content}"
                                    </p>
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
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE CRIAÇÃO DE RAID */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal}
                closeOnOverlayClick={false}
            >
                <ModalAgendamento onFinish={closeModal} />
            </Modal>

        </div>
    );
}