'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CalendarPlus, ChevronLeft, User as UserIcon, MapPin, Lock, X, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import RankSidebar from '@/features/ranking/components/RankSidebar'; 

export default function PublicProfileClientView({ userData, works, meetings }) {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState(null); 

    const validWorks = works.filter(w => w.hasRatings);
    const globalWorksScore = validWorks.reduce((sum, w) => sum + w.totalScore, 0);

    const validMeetings = meetings.filter(m => m.hasRatings);
    const globalMeetingsScore = validMeetings.reduce((sum, m) => sum + m.totalScore, 0);

    const handleCloseModal = (e) => {
        if (e.target.id === 'modal-overlay') setActiveModal(null);
    };

    const renderScore = (score) => {
        const isPositive = score >= 0;
        return (
            <div className={`flex items-center gap-1 font-black ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowBigUp size={16} className="fill-emerald-500" /> : <ArrowBigDown size={16} className="fill-red-500" />}
                <span>{score > 0 ? `+${score}` : score}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden bg-gray-950 font-sans relative">
            <RankSidebar />

            <div className="flex-1 h-full overflow-y-auto p-6 md:p-12 scrollbar-hide">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-amber-500 transition-colors mb-8 group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </button>

                {/* CABEÇALHO DO PERFIL */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-gray-800 pb-12">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        <UserIcon size={60} className="text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                            {userData?.user_name} <span className="text-amber-500">{userData?.last_name}</span>
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                            <span className="bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                🛡️ {userData?.Class?.name_class || 'Sem Classe'}
                            </span>
                            <span className="bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                ⭐ Level {Math.floor((works.length + meetings.length) / 2) + 1}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* CARTÃO DE TRABALHOS */}
                    <div className="bg-gray-900 border border-amber-500/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-amber-500/50"></div>
                        <Briefcase className="text-amber-500 mb-4" size={36} />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">Arquivo de Conhecimento</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">{works.length} Publicações</p>

                        <div className="flex items-center gap-3 mb-8 bg-gray-950 py-3 px-6 rounded-2xl border border-gray-800">
                            <span className={`text-4xl font-black ${globalWorksScore >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {globalWorksScore > 0 ? `+${globalWorksScore}` : globalWorksScore}
                            </span>
                            <div className="flex flex-col items-start justify-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Saldo de Votos</span>
                            </div>
                        </div>

                        <button onClick={() => setActiveModal('works')} className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">
                            Visualizar Trabalhos
                        </button>
                    </div>

                    {/* CARTÃO DE RAIDS */}
                    <div className="bg-gray-900 border border-blue-500/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(59,130,246,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-blue-500/50"></div>
                        <CalendarPlus className="text-blue-500 mb-4" size={36} />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">Missões Lideradas</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">{meetings.length} Missões</p>

                        <div className="flex items-center gap-3 mb-8 bg-gray-950 py-3 px-6 rounded-2xl border border-gray-800">
                            <span className={`text-4xl font-black ${globalMeetingsScore >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {globalMeetingsScore > 0 ? `+${globalMeetingsScore}` : globalMeetingsScore}
                            </span>
                            <div className="flex flex-col items-start justify-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Saldo de Votos</span>
                            </div>
                        </div>

                        <button onClick={() => setActiveModal('meetings')} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">
                            Visualizar Missões
                        </button>
                    </div>

                </div>
            </div>

            {/* MODAL EXPANDIDO */}
            {activeModal && (
                <div id="modal-overlay" onClick={handleCloseModal} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 shrink-0">
                            <div className="flex items-center gap-3">
                                {activeModal === 'works' ? <Briefcase className="text-amber-500" size={28} /> : <CalendarPlus className="text-blue-500" size={28} />}
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest">{activeModal === 'works' ? 'Arquivo de Conhecimento' : 'Missões Lideradas'}</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Histórico completo de {userData?.user_name}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-full transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto scrollbar-hide flex-1 bg-gray-950/50 space-y-4">
                            {/* TRABALHOS */}
                            {activeModal === 'works' && (
                                works.length > 0 ? works.map(work => (
                                    <div key={work.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-amber-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-gray-200 text-lg">{work.subject}</h3>
                                            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{work.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 font-medium">{work.graduation}</span>
                                                {work.hasRatings ? (
                                                    <div className="border-l border-gray-700 pl-3">
                                                        {renderScore(work.totalScore)}
                                                    </div>
                                                ) : <span className="border-l border-gray-700 pl-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Sem Votos</span>}
                                            </div>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest cursor-not-allowed select-none"><Lock size={12} /> Arquivado</span>
                                        </div>
                                    </div>
                                )) : <div className="text-center p-12 border border-dashed border-gray-800 rounded-2xl"><p className="text-gray-600 italic text-sm">Nenhum trabalho publicado.</p></div>
                            )}

                            {/* RAIDS */}
                            {activeModal === 'meetings' && (
                                meetings.length > 0 ? meetings.map(raid => (
                                    <div key={raid.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-gray-200 text-lg">{raid.content || "Missão Sem Nome"}</h3>
                                            <span className="text-[10px] text-blue-400 font-bold uppercase">{raid.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {raid.adress}</span>
                                                <span>📅 {new Date(raid.meeting_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                            </div>
                                            {raid.hasRatings ? renderScore(raid.totalScore) : <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Sem Votos</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 italic">"{raid.content}"</p>
                                    </div>
                                )) : <div className="text-center p-12 border border-dashed border-gray-800 rounded-2xl"><p className="text-gray-600 italic text-sm">Nenhuma raid organizada.</p></div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}