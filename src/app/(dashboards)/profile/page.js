'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Shield, MapPin, Briefcase, Users, Trash2, Edit3, Loader2, Target, Star, X, MessageSquareText, BookOpen } from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [userWorks, setUserWorks] = useState([]);
    const [userRaids, setUserRaids] = useState([]);
    const [userParticipatedRaids, setUserParticipatedRaids] = useState([]);
    const [userDownloadedWorks, setUserDownloadedWorks] = useState([]); // Nova aba de trabalhos
    const [loading, setLoading] = useState(true);

    // Estados para o Modal de Avaliação
    const [ratingModal, setRatingModal] = useState(null); 
    const [modalType, setModalType] = useState(null); // Define se é 'raid' ou 'work'
    const [hoveredStar, setHoveredStar] = useState(0); 
    const [selectedStar, setSelectedStar] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadProfileData() {
            const supabase = createClient();
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const { data: profileData } = await supabase
                    .from('User')
                    .select('*, Class ( name_class, reference_class, description_class )')
                    .eq('id_login', authUser.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);

                    // 1. Trabalhos PUBLICADOS por ele
                    const { data: works } = await supabase
                        .from('Work')
                        .select('*')
                        .eq('user_id', profileData.id)
                        .order('id', { ascending: false });
                    setUserWorks(works || []);

                    // 2. Raids LIDERADAS por ele
                    const { data: raids } = await supabase
                        .from('Meeting')
                        .select('*, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option)')
                        .eq('creator', profileData.id)
                        .order('meeting_date', { ascending: false });
                    setUserRaids(raids || []);

                    // 3. Raids PARTICIPADAS
                    const { data: participatedData } = await supabase
                        .from('User_Meeting')
                        .select(`
                            id, rating, comment,
                            Meeting ( *, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option), User (user_name, last_name) )
                        `)
                        .eq('id_user', profileData.id);

                    if (participatedData) {
                        const joinedRaids = participatedData
                            .filter(item => item.Meeting && item.Meeting.creator !== profileData.id)
                            .map(item => ({
                                ...item.Meeting, user_meeting_id: item.id, user_rating: item.rating, user_comment: item.comment
                            }))
                            .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));
                        
                        setUserParticipatedRaids(joinedRaids);
                    }

                    // 4. Trabalhos ACESSADOS/BAIXADOS (Biblioteca de Consulta)
                    const { data: downloadedData } = await supabase
                        .from('User_Work')
                        .select(`
                            id, rating, comment,
                            Work ( *, User (user_name, last_name) )
                        `)
                        .eq('id_user', profileData.id);

                    if (downloadedData) {
                        const joinedWorks = downloadedData
                            .filter(item => item.Work && item.Work.user_id !== profileData.id)
                            .map(item => ({
                                ...item.Work, user_work_id: item.id, user_rating: item.rating, user_comment: item.comment
                            }))
                            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)); // Ordena pelos mais recentes
                        
                        setUserDownloadedWorks(joinedWorks);
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
            } finally {
                setLoading(false);
            }
        }
        
        loadProfileData();
    }, []);

    // Função unificada de salvar
    const submitRating = async () => {
        if (!ratingModal) return;
        if (selectedStar === 0) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas antes de avaliar.");
            return;
        }

        setIsSubmitting(true);
        const supabase = createClient();
        
        // Define dinamicamente qual tabela e qual ID atualizar
        const table = modalType === 'raid' ? 'User_Meeting' : 'User_Work';
        const idToUpdate = modalType === 'raid' ? ratingModal.user_meeting_id : ratingModal.user_work_id;

        try {
            const { data, error } = await supabase
                .from(table)
                .update({ rating: selectedStar, comment: ratingComment || null }) 
                .eq('id', idToUpdate)
                .select(); 

            if (error) throw error;

            if (!data || data.length === 0) {
                alert(`Acesso Negado! Verifique a permissão de UPDATE na tabela ${table}.`);
                setIsSubmitting(false);
                return;
            }

            // Atualiza a interface correta dependendo do que foi avaliado
            if (modalType === 'raid') {
                setUserParticipatedRaids(prev => prev.map(raid => raid.user_meeting_id === idToUpdate ? { ...raid, user_rating: selectedStar, user_comment: ratingComment } : raid));
            } else {
                setUserDownloadedWorks(prev => prev.map(work => work.user_work_id === idToUpdate ? { ...work, user_rating: selectedStar, user_comment: ratingComment } : work));
            }
            
            setRatingModal(null); 
            setSelectedStar(0);
            setRatingComment('');
        } catch (err) {
            console.error("Erro ao salvar avaliação:", err);
            alert("Não foi possível salvar a sua avaliação.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openRatingModal = (item, type) => {
        setRatingModal(item);
        setModalType(type);
        setSelectedStar(0);
        setRatingComment('');
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans relative">
            
            {/* PAINEL ESQUERDO: Identidade */}
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
                            <div className="hidden md:flex w-24 h-24 bg-slate-900/50 rounded-full border-2 border-slate-400 items-center justify-center mb-6 shadow-[0_0_30px_rgba(148,163,184,0.3)]">
                                <User size={48} className="text-slate-300" />
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 drop-shadow-lg">
                                {profile?.user_name} {profile?.last_name}
                            </h1>
                            
                            <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-bold uppercase text-[10px] tracking-widest bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-500/30 shadow-[0_0_15px_rgba(148,163,184,0.1)]">
                                <Shield size={14} />
                                <span>{profile?.Class?.name_class || 'Caçador'}</span>
                            </div>
                            
                            <p className="text-sm text-slate-300 text-center max-w-xs font-medium leading-relaxed mb-8 italic border-l-2 border-slate-500/50 pl-3">
                                "{profile?.Class?.description_class || 'A sua jornada na guilda começou.'}"
                            </p>

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

            {/* PAINEL DIREITO: Histórico */}
            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                
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
                        
                        {/* 1. SEÇÃO DE TRABALHOS */}
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

                        {/* 2. SEÇÃO DE RAIDS LIDERADAS */}
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
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">{new Date(raid.meeting_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                            </div>
                                            <h4 className="text-white font-bold truncate group-hover:text-purple-300 transition-colors">{raid.theme?.option || 'Sem Tema'}</h4>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 3. NOVA SEÇÃO DE TRABALHOS ACESSADOS (Biblioteca de Consulta) */}
                        <section>
                            <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4">
                                <BookOpen size={20} className="text-amber-500" /> Biblioteca de Consulta
                            </h3>
                            
                            {userDownloadedWorks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-amber-500/20 rounded-2xl bg-gray-900/50">
                                    <p className="text-gray-500 italic text-sm">Nenhum material de estudo acessado ainda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userDownloadedWorks.map(work => (
                                        <div key={work.user_work_id} className="flex flex-col p-5 bg-gray-900 border border-amber-500/30 rounded-xl hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all group relative min-h-[140px]">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">{work.type} • {work.graduation}</span>
                                            </div>
                                            <h4 className="text-white font-bold truncate group-hover:text-amber-300 transition-colors mb-4">{work.subject}</h4>
                                            
                                            <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between">
                                                {work.user_rating ? (
                                                    <div className="flex items-center gap-1 text-yellow-500" title={work.user_comment}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} fill={i < work.user_rating ? "currentColor" : "none"} className={i < work.user_rating ? "text-yellow-500" : "text-gray-600"} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => openRatingModal(work, 'work')}
                                                        className="text-[10px] uppercase font-bold tracking-widest text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        Avaliar Material
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 4. SEÇÃO DE RAIDS PARTICIPADAS COM AVALIAÇÃO */}
                        <section>
                            <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4">
                                <Target size={20} className="text-emerald-500" /> Raids Participadas
                            </h3>
                            
                            {userParticipatedRaids.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-emerald-500/20 rounded-2xl bg-gray-900/50">
                                    <p className="text-gray-500 italic text-sm">Ainda não participou em nenhuma raid.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userParticipatedRaids.map(raid => {
                                        const now = new Date();
                                        const utcDate = new Date(raid.meeting_date);
                                        const raidDate = new Date(
                                            utcDate.getUTCFullYear(),
                                            utcDate.getUTCMonth(),
                                            utcDate.getUTCDate(),
                                            utcDate.getUTCHours(),
                                            utcDate.getUTCMinutes()
                                        );
                                        const hasPassed = raidDate < now; 

                                        return (
                                            <div key={raid.user_meeting_id} className="flex flex-col p-5 bg-gray-900 border border-emerald-500/30 rounded-xl hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group relative min-h-[140px]">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{raid.group_category?.option}</span>
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase">{utcDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                                </div>
                                                <h4 className="text-white font-bold truncate group-hover:text-emerald-300 transition-colors mb-4">{raid.theme?.option || 'Sem Tema'}</h4>
                                                
                                                <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between">
                                                    {!hasPassed ? (
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/70 bg-emerald-500/10 px-2 py-1 rounded">Em Breve</span>
                                                    ) : raid.user_rating ? (
                                                        <div className="flex items-center gap-1 text-yellow-500" title={raid.user_comment}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < raid.user_rating ? "currentColor" : "none"} className={i < raid.user_rating ? "text-yellow-500" : "text-gray-600"} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => openRatingModal(raid, 'raid')}
                                                            className="text-[10px] uppercase font-bold tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded transition-colors"
                                                        >
                                                            Avaliar Raid
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-center pb-20 md:pb-0">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors bg-gray-900/50 px-4 py-2 rounded-lg hover:bg-red-950/30 hover:border-red-500/30 border border-transparent">
                        <Trash2 size={14} /> Encerrar Jornada e Deletar Conta
                    </button>
                </div>
            </div>

            {/* MODAL DE AVALIAÇÃO ATUALIZADO */}
            {ratingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`bg-gray-950 border rounded-2xl w-full max-w-md flex flex-col overflow-hidden ${modalType === 'raid' ? 'border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]'}`}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900/50">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                {modalType === 'raid' ? <Target size={16} className="text-emerald-500" /> : <BookOpen size={16} className="text-amber-500" />}
                                Avaliar {modalType === 'raid' ? 'Missão' : 'Material'}
                            </h2>
                            <button 
                                onClick={() => setRatingModal(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col items-center">
                            <div className="w-full text-center mb-6 pb-6 border-b border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {modalType === 'raid' ? ratingModal.theme?.option || 'Raid sem tema' : ratingModal.subject}
                                </h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                                    {modalType === 'raid' ? 'Organizada por: ' : 'Publicado por: '}
                                    <span className={modalType === 'raid' ? 'text-emerald-400' : 'text-amber-400'}>
                                        {ratingModal.User?.user_name || 'Desconhecido'} {ratingModal.User?.last_name || ''}
                                    </span>
                                </p>
                            </div>
                            
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Qual a sua nota?</p>
                            <div className="flex gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = (hoveredStar || selectedStar) >= star;
                                    return (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            onClick={() => setSelectedStar(star)}
                                            disabled={isSubmitting}
                                            className="transform hover:scale-110 transition-transform disabled:opacity-50"
                                        >
                                            <Star 
                                                size={32} 
                                                fill={isFilled ? "#eab308" : "none"} 
                                                className={isFilled ? "text-yellow-500" : "text-gray-600"} 
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center h-4 mb-6">
                                {hoveredStar === 1 || (selectedStar === 1 && hoveredStar === 0) ? "Precisa melhorar muito" : 
                                 hoveredStar === 2 || (selectedStar === 2 && hoveredStar === 0) ? "Abaixo das expectativas" :
                                 hoveredStar === 3 || (selectedStar === 3 && hoveredStar === 0) ? "Conteúdo Padrão" :
                                 hoveredStar === 4 || (selectedStar === 4 && hoveredStar === 0) ? "Ótima Execução" :
                                 hoveredStar === 5 || (selectedStar === 5 && hoveredStar === 0) ? "Perfeito!" : "Selecione uma nota"}
                            </p>

                            <div className="w-full mb-6">
                                <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                                    <MessageSquareText size={14} /> Comentários (Opcional)
                                </label>
                                <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder={modalType === 'raid' ? "Deixe um feedback sobre a organização da raid..." : "O que achou deste material de estudo?"}
                                    className="w-full h-24 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 focus:outline-none resize-none transition-all placeholder:text-gray-600"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                onClick={submitRating}
                                disabled={isSubmitting || selectedStar === 0}
                                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    selectedStar > 0 
                                    ? (modalType === 'raid' ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]")
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Salvando...</span>
                                ) : (
                                    "Salvar Avaliação"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}