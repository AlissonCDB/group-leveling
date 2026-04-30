'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, MapPin, Briefcase, Users, Trash2, Edit3, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [userWorks, setUserWorks] = useState([]);
    const [userRaids, setUserRaids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfileData() {
            const supabase = createClient();
            try {
                // 1. Obter o utilizador autenticado
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                // 2. Buscar o Perfil e a Classe do Utilizador
                const { data: profileData } = await supabase
                    .from('User')
                    .select('*, Class ( name_class, reference_class, description_class )')
                    .eq('id_login', authUser.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);

                    // 3. Buscar os Trabalhos publicados pelo Utilizador
                    const { data: works } = await supabase
                        .from('Work')
                        .select('*')
                        .eq('user_id', profileData.id)
                        .order('id', { ascending: false });
                    setUserWorks(works || []);

                    // 4. Buscar as Raids criadas pelo Utilizador
                    const { data: raids } = await supabase
                        .from('Meeting')
                        .select('*, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option)')
                        .eq('creator', profileData.id)
                        .order('meeting_date', { ascending: false });
                    setUserRaids(raids || []);
                }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
            } finally {
                setLoading(false);
            }
        }
        
        loadProfileData();
    }, []);

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans">
            
            {/* PAINEL ESQUERDO: Identidade (Cinza/Prata Metálico) */}
            <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-slate-800 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                    
                    {loading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Loader2 size={48} className="text-slate-400 animate-spin mb-4" />
                            <p className="text-slate-300 uppercase tracking-widest text-xs font-bold">A Sincronizar...</p>
                        </div>
                    ) : (
                        <>
                            {/* Avatar */}
                            <div className="hidden md:flex w-24 h-24 bg-slate-900/50 rounded-full border-2 border-slate-400 items-center justify-center mb-6 shadow-[0_0_30px_rgba(148,163,184,0.3)]">
                                <User size={48} className="text-slate-300" />
                            </div>
                            
                            {/* Nome e Classe */}
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 drop-shadow-lg">
                                {profile?.user_name} {profile?.last_name}
                            </h1>
                            
                            <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-bold uppercase text-[10px] tracking-widest bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-500/30 shadow-[0_0_15px_rgba(148,163,184,0.1)]">
                                <Shield size={14} />
                                <span>{profile?.Class?.name_class || 'Caçador'}</span>
                            </div>
                            
                            {/* Lore da Classe */}
                            <p className="text-sm text-slate-300 text-center max-w-xs font-medium leading-relaxed mb-8 italic border-l-2 border-slate-500/50 pl-3">
                                "{profile?.Class?.description_class || 'A sua jornada na guilda começou.'}"
                            </p>

                            {/* Afinidade */}
                            <div className="flex flex-col items-center mb-8 w-full">
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                    <MapPin size={10} /> Afinidade Tech
                                </span>
                                <span className="text-white font-bold">{profile?.Class?.reference_class || 'Geral'}</span>
                            </div>

                            <button onClick={() => alert('Edição em breve!')} className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white uppercase font-bold tracking-widest transition-colors px-4 py-2 border border-transparent hover:border-slate-500/30 rounded-lg hover:bg-slate-800/50">
                                <Edit3 size={14} /> Atualizar Perfil
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* PAINEL DIREITO: Histórico e Arquivos */}
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
                {/* Cabeçalho */}
                <div className="mb-8 border-b border-slate-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">O Seu Histórico</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registo de contribuições na guilda</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-slate-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">A Carregar Arquivos...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 flex-1">
                        
                        {/* Seção de Trabalhos - Mantém as cores Azuis do módulo de Works para associação visual */}
                        <section>
                            <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4">
                                <Briefcase size={20} className="text-blue-500" /> Trabalhos Publicados
                            </h3>
                            
                            {userWorks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-500/20 rounded-2xl bg-gray-900/50">
                                    <p className="text-gray-500 italic text-sm">Nenhum trabalho publicado ainda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userWorks.map(work => (
                                        <div key={work.id} className="flex flex-col p-5 bg-gray-900 border border-blue-500/30 rounded-xl hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all group">
                                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2">{work.type} • {work.graduation}</span>
                                            <h4 className="text-white font-bold truncate group-hover:text-blue-300 transition-colors">{work.subject}</h4>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Seção de Raids Lideradas - Mantém as cores Roxas do módulo de Raids */}
                        <section>
                            <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4">
                                <Users size={20} className="text-purple-500" /> Raids Lideradas
                            </h3>
                            
                            {userRaids.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-500/20 rounded-2xl bg-gray-900/50">
                                    <p className="text-gray-500 italic text-sm">Nenhuma raid agendada ainda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userRaids.map(raid => (
                                        <div key={raid.id} className="flex flex-col p-5 bg-gray-900 border border-purple-500/30 rounded-xl hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">{raid.group_category?.option}</span>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">{new Date(raid.meeting_date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <h4 className="text-white font-bold truncate group-hover:text-purple-300 transition-colors">{raid.theme?.option || 'Sem Tema'}</h4>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                )}

                {/* Footer de Perigo */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-center pb-20 md:pb-0">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors bg-gray-900/50 px-4 py-2 rounded-lg hover:bg-red-950/30 hover:border-red-500/30 border border-transparent">
                        <Trash2 size={14} /> Encerrar Jornada e Deletar Conta
                    </button>
                </div>
            </div>
        </div>
    );
}