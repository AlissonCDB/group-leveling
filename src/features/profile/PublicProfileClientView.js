'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CalendarPlus, ChevronLeft, User as UserIcon, MapPin, Lock, Star } from 'lucide-react';
import RankSidebar from '@/features/ranking/components/RankSidebar'; 

export default function PublicProfileClientView({ userData, works, meetings }) {
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden bg-gray-950 font-sans">
            <RankSidebar />

            <div className="flex-1 h-full overflow-y-auto p-6 md:p-12 scrollbar-hide">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-amber-500 transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
                </button>

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* TRABALHOS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="text-amber-500" size={24} />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Arquivo de Conhecimento</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {works.length > 0 ? works.map(work => (
                                <div key={work.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-200">{work.subject}</h3>
                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{work.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{work.graduation}</span>
                                            
                                            {/* AVALIAÇÃO COM FALLBACK */}
                                            {work.avgRating > 0 ? (
                                                <div className="flex items-center gap-0.5 border-l border-gray-700 pl-3" title={`Média: ${work.avgRating.toFixed(1)}`}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={12} 
                                                            className={i < Math.round(work.avgRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center border-l border-gray-700 pl-3">
                                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Sem Avaliações</span>
                                                </div>
                                            )}
                                        </div>

                                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest cursor-not-allowed select-none">
                                            <Lock size={12} /> Registo Arquivado
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-600 italic text-sm">Este membro ainda não contribuiu com arquivos.</p>
                            )}
                        </div>
                    </section>

                    {/* RAIDS */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <CalendarPlus className="text-blue-500" size={24} />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Missões Lideradas</h2>
                        </div>

                        <div className="space-y-4">
                            {meetings.length > 0 ? meetings.map(raid => (
                                <div key={raid.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-200">{raid.content || "Missão Sem Nome"}</h3>
                                        <span className="text-[10px] text-blue-400 font-bold uppercase">{raid.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1"><MapPin size={12}/> {raid.adress}</span>
                                            {/* Formatação para SSR */}
                                            <span>📅 {new Date(raid.meeting_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                        </div>
                                        
                                        {/* AVALIAÇÃO COM FALLBACK */}
                                        {raid.avgRating > 0 ? (
                                            <div className="flex items-center gap-0.5" title={`Média: ${raid.avgRating.toFixed(1)}`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={12} 
                                                        className={i < Math.round(raid.avgRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Sem Avaliações</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 italic">"{raid.content}"</p>
                                </div>
                            )) : (
                                <p className="text-gray-600 italic text-sm">Este membro ainda não organizou raids.</p>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}