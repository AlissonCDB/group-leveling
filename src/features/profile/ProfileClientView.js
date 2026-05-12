'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Briefcase, Users, Trash2, Target, Star, BookOpen } from 'lucide-react';
import ProfileSidebar from './components/ProfileSidebar';
import RatingModal from './components/RatingModal';

export default function ProfileClientView({ profile, initialWorks, initialRaids, initialParticipatedRaids, initialDownloadedWorks }) {
    
    const [userParticipatedRaids, setUserParticipatedRaids] = useState(initialParticipatedRaids);
    const [userDownloadedWorks, setUserDownloadedWorks] = useState(initialDownloadedWorks);
    const [ratingModal, setRatingModal] = useState(null); 
    const [modalType, setModalType] = useState(null); 

    const handleOpenModal = (item, type) => {
        setRatingModal(item);
        setModalType(type);
    };

    const handleSubmitRating = async (selectedStar, ratingComment) => {
        const supabase = createClient();
        const table = modalType === 'raid' ? 'User_Meeting' : 'User_Work';
        const idToUpdate = modalType === 'raid' ? ratingModal.user_meeting_id : ratingModal.user_work_id;

        try {
            const { error } = await supabase.from(table).update({ rating: selectedStar, comment: ratingComment || null }).eq('id', idToUpdate); 
            if (error) throw error;

            // Atualiza a lista visualmente
            if (modalType === 'raid') {
                setUserParticipatedRaids(prev => prev.map(r => r.user_meeting_id === idToUpdate ? { ...r, user_rating: selectedStar, user_comment: ratingComment } : r));
            } else {
                setUserDownloadedWorks(prev => prev.map(w => w.user_work_id === idToUpdate ? { ...w, user_rating: selectedStar, user_comment: ratingComment } : w));
            }
            setRatingModal(null); 
        } catch (err) {
            console.error("Erro ao salvar avaliação:", err);
            alert("Não foi possível guardar a sua avaliação.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans relative">
            
            <ProfileSidebar profile={profile} />

            <div className="w-full md:w-2/3 h-3/5 md:h-full bg-gray-950 flex flex-col p-6 md:p-12 overflow-y-auto scrollbar-hide">
                <div className="mb-8 border-b border-slate-500/20 pb-6">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">O Seu Histórico</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registo de contribuições na guilda</p>
                </div>

                <div className="flex flex-col gap-8 flex-1">
                    
                    {/* 1. Trabalhos Publicados */}
                    <section>
                        <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4"><Briefcase size={20} className="text-blue-500" /> Trabalhos Publicados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {initialWorks.length > 0 ? initialWorks.map(work => (
                                <div key={work.id} className="p-5 bg-gray-900 border border-blue-500/30 rounded-xl">
                                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">{work.type} • {work.graduation}</span>
                                    <h4 className="text-white font-bold truncate">{work.subject}</h4>
                                </div>
                            )) : <p className="text-gray-500 italic text-sm">Nenhum trabalho publicado.</p>}
                        </div>
                    </section>

                    {/* 2. Raids Lideradas */}
                    <section>
                        <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4"><Users size={20} className="text-purple-500" /> Raids Lideradas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {initialRaids.length > 0 ? initialRaids.map(raid => (
                                <div key={raid.id} className="p-5 bg-gray-900 border border-purple-500/30 rounded-xl">
                                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-2 block">{raid.group_category?.option}</span>
                                    <h4 className="text-white font-bold truncate">{raid.theme?.option || 'Sem Tema'}</h4>
                                </div>
                            )) : <p className="text-gray-500 italic text-sm">Nenhuma raid agendada.</p>}
                        </div>
                    </section>

                    {/* 3. Biblioteca de Consulta */}
                    <section>
                        <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4"><BookOpen size={20} className="text-amber-500" /> Biblioteca de Consulta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userDownloadedWorks.length > 0 ? userDownloadedWorks.map(work => (
                                <div key={work.user_work_id} className="flex flex-col p-5 bg-gray-900 border border-amber-500/30 rounded-xl min-h-35">
                                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2">{work.type}</span>
                                    <h4 className="text-white font-bold truncate mb-4">{work.subject}</h4>
                                    <div className="mt-auto pt-3 border-t border-gray-800 flex justify-end">
                                        {work.user_rating ? (
                                            /*  Estrelas desenhadas dinamicamente */
                                            <div className="flex gap-1" title={`${work.user_rating} Estrelas`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={14} 
                                                        className={i < work.user_rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <button onClick={() => handleOpenModal(work, 'work')} className="text-[10px] uppercase font-bold tracking-widest text-white bg-amber-600 px-3 py-1.5 rounded">Avaliar Material</button>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 italic text-sm">Nenhum material acessado.</p>}
                        </div>
                    </section>

                    {/* 4. Raids Participadas */}
                    <section>
                        <h3 className="flex items-center gap-2 font-black text-white uppercase tracking-tight mb-4"><Target size={20} className="text-emerald-500" /> Raids Participadas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userParticipatedRaids.length > 0 ? userParticipatedRaids.map(raid => {
                                const hasPassed = new Date(raid.meeting_date) < new Date(); 
                                return (
                                    <div key={raid.user_meeting_id} className="flex flex-col p-5 bg-gray-900 border border-emerald-500/30 rounded-xl min-h-35">
                                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">{raid.group_category?.option}</span>
                                        <h4 className="text-white font-bold truncate mb-4">{raid.theme?.option || 'Sem Tema'}</h4>
                                        <div className="mt-auto pt-3 border-t border-gray-800 flex justify-end">
                                            {!hasPassed ? <span className="text-[10px] uppercase font-bold text-emerald-500">Em Breve</span>
                                            : raid.user_rating ? (
                                                /* 🔴 MUDANÇA: Estrelas desenhadas dinamicamente */
                                                <div className="flex gap-1" title={`${raid.user_rating} Estrelas`}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            className={i < raid.user_rating ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <button onClick={() => handleOpenModal(raid, 'raid')} className="text-[10px] uppercase font-bold tracking-widest text-white bg-emerald-600 px-3 py-1.5 rounded">Avaliar Raid</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : <p className="text-gray-500 italic text-sm">Nenhuma participação.</p>}
                        </div>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-center pb-20 md:pb-0">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors">
                        <Trash2 size={14} /> Encerrar Jornada e Deletar Conta
                    </button>
                </div>
            </div>

            <RatingModal 
                modalData={ratingModal} 
                modalType={modalType} 
                onClose={() => setRatingModal(null)} 
                onSubmitRating={handleSubmitRating} 
            />
        </div>
    );
}