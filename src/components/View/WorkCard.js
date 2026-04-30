import React from 'react';
import { FileText, GraduationCap, Link as LinkIcon, User, Edit } from 'lucide-react';

export default function WorkCard({ work, currentUserId, onEdit }) {
    const isCreator = currentUserId === work.user_id;

    return (
        <div className={`relative flex flex-col justify-between p-6 bg-gray-900 border rounded-2xl group transition-all duration-300 ${isCreator ? 'border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}>
            <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                    
                    {/* Título: Assunto / Subject */}
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                        {work.subject}
                    </h4>
                    
                    {/* Tags: Tipo e Graduação */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-1 bg-blue-900/30 text-[9px] text-blue-400 font-bold rounded border border-blue-500/30 uppercase flex items-center gap-1">
                            <FileText size={10} /> {work.type}
                        </span>
                        <span className="px-2 py-1 bg-cyan-900/30 text-[9px] text-cyan-400 font-bold rounded border border-cyan-500/30 uppercase flex items-center gap-1">
                            <GraduationCap size={10} /> {work.graduation}
                        </span>
                    </div>
                </div>

                {/* Exibição do Link / Arquivo */}
                <div className="mb-4 text-xs bg-black/40 p-3 rounded-lg border border-gray-800 break-all flex items-start gap-2">
                    <LinkIcon size={14} className="text-blue-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-gray-500 font-bold uppercase text-[9px] tracking-widest mb-1">Arquivo Remoto</span>
                        <a href={work.archive} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-2">
                            {work.archive}
                        </a>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center pt-4 border-t border-blue-500/10">
                    
                    {/* Dados do Autor */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-xs font-black text-white shadow-lg">
                            {work.User?.user_name?.[0].toUpperCase() || '?'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-white font-black uppercase tracking-wider">
                                {work.User?.user_name || 'Desconhecido'} {work.User?.last_name || ''}
                            </span>
                            <span className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                                <User size={10}/> Autor
                            </span>
                        </div>
                    </div>
                    
                    {/* Acões */}
                    <div className="flex gap-2 items-center">
                        {isCreator && (
                            <button 
                                onClick={() => onEdit && onEdit(work)} 
                                className="p-1.5 text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/30 rounded-lg transition-all border border-amber-500/30" 
                                title="Editar Trabalho"
                            >
                                <Edit size={16} />
                            </button>
                        )}
                        
                        <a 
                            href={work.archive} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                        >
                            Acessar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}