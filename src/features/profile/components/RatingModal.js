import React, { useState } from 'react';
import { Target, BookOpen, X, Star, MessageSquareText, Loader2 } from 'lucide-react';

export default function RatingModal({ modalData, modalType, onClose, onSubmitRating }) {
    const [hoveredStar, setHoveredStar] = useState(0); 
    const [selectedStar, setSelectedStar] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!modalData) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await onSubmitRating(selectedStar, ratingComment);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-gray-950 border rounded-2xl w-full max-w-md flex flex-col overflow-hidden ${modalType === 'raid' ? 'border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]'}`}>
                
                <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900/50">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        {modalType === 'raid' ? <Target size={16} className="text-emerald-500" /> : <BookOpen size={16} className="text-amber-500" />}
                        Avaliar {modalType === 'raid' ? 'Missão' : 'Material'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 flex flex-col items-center">
                    <div className="w-full text-center mb-6 pb-6 border-b border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-2">
                            {modalType === 'raid' ? modalData.theme?.option || 'Raid sem tema' : modalData.subject}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                            {modalType === 'raid' ? 'Organizada por: ' : 'Publicado por: '}
                            <span className={modalType === 'raid' ? 'text-emerald-400' : 'text-amber-400'}>
                                {modalData.User?.user_name || 'Desconhecido'} {modalData.User?.last_name || ''}
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
                                    <Star size={32} fill={isFilled ? "#eab308" : "none"} className={isFilled ? "text-yellow-500" : "text-gray-600"} />
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="w-full mb-6 mt-4">
                        <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                            <MessageSquareText size={14} /> Comentários (Opcional)
                        </label>
                        <textarea
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            placeholder={modalType === 'raid' ? "Deixe um feedback sobre a organização da raid..." : "O que achou deste material de estudo?"}
                            className="w-full h-24 bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-sm focus:outline-none resize-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedStar === 0}
                        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            selectedStar > 0 
                            ? (modalType === 'raid' ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-amber-600 hover:bg-amber-500 text-white")
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {isSubmitting ? "A Guardar..." : "Guardar Avaliação"}
                    </button>
                </div>
            </div>
        </div>
    );
}