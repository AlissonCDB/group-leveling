import React from 'react';
import { Trophy, X } from 'lucide-react';
import RankingList, { getRankStyles } from './RankingList';

export default function RankingModal({ isOpen, onClose, rankingData, currentUserId, onUserClick }) {
    if (!isOpen) return null;

    const myRankIndex = rankingData.findIndex(u => u.id === currentUserId);
    const myRankData = myRankIndex !== -1 ? rankingData[myRankIndex] : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden">
                
                {/* Header do Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-amber-400" size={28} />
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">
                                Ranking <span className="text-amber-500">Geral</span>
                            </h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">
                                Classificação completa de XP
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Lista Completa */}
                <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
                    <RankingList 
                        rankingData={rankingData}
                        emptyMessage="A guilda está inativa."
                        currentUserId={currentUserId}
                        onUserClick={onUserClick}
                    />
                </div>

                {/* Rodapé: Posição do Utilizador */}
                <div className="bg-gray-900 border-t border-gray-800 p-4 sm:px-6 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-10 relative">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3 pl-2">Sua Posição Atual</p>
                    {myRankData ? (
                        <div className="flex items-center p-3 rounded-xl border border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            <div className="w-16 flex justify-center items-center font-black text-xl">
                                {myRankIndex < 3 ? getRankStyles(myRankIndex).icon : <span className="text-amber-500">#{myRankIndex + 1}</span>}
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                                    <span className="font-bold text-amber-400">{myRankData.name?.charAt(0).toUpperCase() || '?'}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-amber-400">{myRankData.name || 'Você'} <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2 uppercase">Você</span></h3>
                                </div>
                            </div>
                            <div className="w-24 text-center">
                                <div className="text-sm font-bold text-gray-300">Lvl <span className="text-amber-400">{myRankData.level}</span></div>
                            </div>
                            <div className="w-32 text-right">
                                <div className="text-sm font-black text-amber-400">{myRankData.score} <span className="text-[10px] text-amber-500 uppercase ml-1">XP</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-4 rounded-xl border border-dashed border-gray-700 bg-gray-950">
                            <p className="text-gray-500 italic text-sm">Você não possui XP neste período.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}