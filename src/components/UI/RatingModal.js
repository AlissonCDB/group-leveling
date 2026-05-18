import React, { useState, useEffect } from 'react';
import { Target, BookOpen, X, ArrowBigUp, ArrowBigDown, MessageSquareText, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { ratingService } from '@/services/rating.service';
import FeedbackToast from '@/components/UI/FeedbackToast';

export default function RatingModal({ modalData, modalType, onClose, onSuccess }) {
    const [selectedVote, setSelectedVote] = useState(0); 
    const [ratingComment, setRatingComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (modalData) {
            setSelectedVote(modalData.user_rating || 0);
            setRatingComment(modalData.user_comment || '');
        }
    }, [modalData]);

    if (!modalData) return null;

    const handleConfirmRating = async () => {
        if (selectedVote === 0) {
            setToast({ show: true, message: 'Selecione um voto (Aprovar ou Reprovar)', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        const supabase = createClient();

        try {
            if (modalType === 'raid') {
                const idToUpdate = modalData.user_meeting_id || modalData.id;
                await ratingService.rateRaid(supabase, idToUpdate, selectedVote, ratingComment);
            } else {
                const idToUpdate = modalData.user_work_id || modalData.id;
                await ratingService.rateWork(supabase, idToUpdate, selectedVote, ratingComment);
            }

            setToast({ show: true, message: 'Avaliação guardada com sucesso!', type: 'success' });
            
            if (onSuccess) {
                onSuccess(selectedVote, ratingComment);
            }

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            console.error("Erro interno no RatingModal:", error.message);
            setToast({ show: true, message: 'Erro ao salvar avaliação. Tente novamente.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                    {modalType === 'raid' ? (
                        <>
                            <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-tight text-sm">Avaliar Raid</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-xs">{modalData.theme?.option || 'Missão'}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-tight text-sm">Avaliar Estudo</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-xs">{modalData.subject || 'Material'}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Corpo de Votação (Upvote / Downvote) */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setSelectedVote(1)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-xl transition-all cursor-pointer ${
                            selectedVote === 1 
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <ArrowBigUp size={28} className={selectedVote === 1 ? 'fill-emerald-500' : ''} />
                        <span className="text-[10px] uppercase font-black tracking-wider">Aprovar</span>
                    </button>

                    <button 
                        onClick={() => setSelectedVote(-1)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-xl transition-all cursor-pointer ${
                            selectedVote === -1 
                            ? 'bg-red-950/40 border-red-500/60 text-red-400' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <ArrowBigDown size={28} className={selectedVote === -1 ? 'fill-red-500' : ''} />
                        <span className="text-[10px] uppercase font-black tracking-wider">Reprovar</span>
                    </button>
                </div>

                {/* Comentário Opcional */}
                <div className="flex flex-col gap-2 mb-6">
                    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <MessageSquareText size={12} /> Nota de Feedback <span className="text-slate-600 font-normal lowercase">(opcional)</span>
                    </label>
                    <textarea 
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Escreva um breve feedback sobre a experiência..."
                        maxLength={200}
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                </div>

                {/* Ação de Submissão */}
                <button 
                    onClick={handleConfirmRating}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" /> Salvando Voto
                        </>
                    ) : 'Confirmar Voto'}
                </button>
            </div>

            {/* Feedback gerido pelo próprio Modal */}
            {toast.show && (
                <FeedbackToast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
        </div>
    );
}