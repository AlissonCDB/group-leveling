import React from 'react';
import { Calendar, Clock, MonitorPlay, MapPin, Wifi, Layers, Edit } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';

// Adicione onEnter nos parâmetros:
export default function RaidCard({ raid, currentUserId, onEdit, onEnter }) {
    const now = new Date();
    
    const templateName = raid.meeting_tamplate?.option || 'Indefinido';
    const isRemoteLike = templateName.toLowerCase().includes('remoto') || templateName.toLowerCase().includes('online') || templateName.toLowerCase().includes('vr');
    
    const platformName = raid.plataform_meeting?.option || 'Plataforma';
    const categoryName = raid.group_category?.option || 'Geral';
    const cardTitle = raid.theme?.option || 'Sem Tema';
    
    const isCreator = currentUserId === raid.creator;
    const isPast = new Date(raid.meeting_date) < now;

    return (
        <div className={`relative flex flex-col justify-between p-6 bg-gray-900 border rounded-2xl group transition-all duration-300 ${isPast ? 'opacity-70 hover:opacity-100 grayscale-[0.3]' : ''} ${isCreator && !isPast ? 'border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'}`}>
            <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                    <h4 className={`text-2xl font-black uppercase tracking-tight transition-colors ${isPast ? 'text-gray-400 group-hover:text-white' : 'text-white group-hover:text-purple-400'}`}>
                        {cardTitle}
                    </h4>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-1 bg-amber-900/30 text-[9px] text-amber-400 font-bold rounded border border-amber-500/30 uppercase flex items-center gap-1"><Layers size={10} /> {categoryName}</span>
                        <span className={`px-2 py-1 text-[9px] font-bold rounded border uppercase flex items-center gap-1 ${isRemoteLike ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'}`}>{isRemoteLike ? <Wifi size={10} /> : <MapPin size={10} />} {templateName}</span>
                        <span className="px-2 py-1 bg-purple-900/30 text-[9px] text-purple-300 font-bold rounded border border-purple-500/30 uppercase flex items-center gap-1"><MonitorPlay size={10} /> {platformName}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-400 italic mb-4 line-clamp-3 leading-relaxed border-l-2 border-purple-500/30 pl-3">"{raid.content}"</p>
                
                {raid.adress && (
                    <div className="mb-4 text-xs bg-black/40 p-2 rounded-lg border border-gray-800 break-all">
                        <span className={`${isPast ? 'text-gray-500' : 'text-purple-400'} font-bold mr-1`}>{isRemoteLike ? '🔗 Link:' : '📍 Local:'}</span> 
                        <span className="text-gray-300">{raid.adress}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-300 text-xs font-medium bg-gray-950 p-3 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2"><Calendar size={14} className={isPast ? "text-gray-500" : "text-purple-500"} /><span>{new Date(raid.meeting_date).toLocaleDateString('pt-BR')}</span></div>
                    <div className="flex items-center gap-2"><Clock size={14} className={isPast ? "text-gray-500" : "text-purple-500"} /><span>{new Date(raid.meeting_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} <span className="text-gray-500 ml-1">({raid.duration})</span></span></div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-black text-white shadow-lg">{raid.User?.user_name?.[0].toUpperCase() || '?'}</div>
                        <div className="flex flex-col"><span className="text-xs text-white font-black uppercase tracking-wider">{raid.User?.user_name || 'Desconhecido'}</span><span className="text-[10px] text-purple-400 font-bold uppercase">Líder</span></div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        {isCreator && !isPast && (
                            <button onClick={() => onEdit(raid)} className="p-1.5 text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/30 rounded-lg transition-all border border-amber-500/30" title="Editar Reunião">
                                <Edit size={16} />
                            </button>
                        )}
                        
                        {isPast ? (
                            <span className="px-3 py-1 bg-gray-800 text-[10px] text-gray-400 font-bold rounded-lg border border-gray-700 uppercase">
                                Encerrada
                            </span>
                        ) : (
                            /* <-- AQUI: Atualizamos o onClick para disparar o onEnter --> */
                            <PrimaryButton style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '10px' }} onClick={onEnter}>
                                Entrar
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}