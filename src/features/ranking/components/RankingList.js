import React from 'react';
import { Trophy, Medal, Award, ArrowBigUp, ArrowBigDown } from 'lucide-react';

export const getRankStyles = (index) => {
    switch (index) {
        case 0: return { color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', icon: <Trophy size={24} className="text-yellow-400" /> };
        case 1: return { color: 'text-gray-300', border: 'border-gray-300/50', bg: 'bg-gray-300/10', icon: <Medal size={24} className="text-gray-300" /> };
        case 2: return { color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10', icon: <Medal size={24} className="text-orange-400" /> };
        default: return { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-gray-900', icon: <Award size={20} className="text-gray-500" /> };
    }
};

export default function RankingList({ rankingData, emptyMessage, currentUserId, onUserClick }) {
    if (rankingData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-800 rounded-2xl p-8 my-4">
                <Trophy size={40} className="text-gray-700 mb-3 opacity-50" />
                <p className="text-gray-500 italic text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="hidden md:flex px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="w-16 text-center">Rank</div>
                <div className="flex-1">Membro</div>
                <div className="w-24 text-center">Nível</div>
                <div className="w-48 text-right">Progressão</div>
            </div>

            {rankingData.map((user, index) => {
                const rankStyle = getRankStyles(index);
                const isMe = currentUserId === user.id;

                return (
                    <div 
                        key={user.id} 
                        onClick={() => onUserClick(user.id)} 
                        className={`flex items-center p-4 rounded-xl border ${rankStyle.border} ${rankStyle.bg} hover:bg-gray-800 transition-all cursor-pointer relative overflow-hidden group`}
                    >
                        {isMe && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />}
                        
                        <div className="w-16 flex justify-center items-center font-black text-xl">
                            {index < 3 ? rankStyle.icon : <span className="text-gray-600">#{index + 1}</span>}
                        </div>
                        
                        <div className="flex-1 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                                <span className={`font-bold ${rankStyle.color}`}>{user.name?.charAt(0).toUpperCase() || '?'}</span>
                            </div>
                            <div>
                                <h3 className={`font-bold text-base ${isMe ? 'text-amber-400' : 'text-gray-200'}`}>
                                    {user.name || 'Usuário Desconhecido'} 
                                    {isMe && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2 uppercase">Você</span>}
                                </h3>
                            </div>
                        </div>
                        
                        {/* NOVO: Exibição do Nível Dinâmico */}
                        <div className="w-24 text-center">
                            <div className="text-sm font-bold text-gray-300">
                                Lvl <span className={rankStyle.color}>{user.level}</span>
                            </div>
                        </div>

                        {/* NOVO: Exibição detalhada de XP e Votos */}
                        <div className="w-48 flex flex-col items-end justify-center">
                            <div className="text-sm font-black text-gray-200">
                                {user.score} <span className="text-[10px] text-gray-500 uppercase ml-1">XP</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {user.upvotes > 0 && <span className="flex items-center text-[10px] text-emerald-500 font-bold"><ArrowBigUp size={12} className="fill-emerald-500 mr-0.5"/> {user.upvotes}</span>}
                                {user.downvotes > 0 && <span className="flex items-center text-[10px] text-red-500 font-bold"><ArrowBigDown size={12} className="fill-red-500 mr-0.5"/> {user.downvotes}</span>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}