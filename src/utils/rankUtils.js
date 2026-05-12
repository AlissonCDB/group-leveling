import { Trophy, Medal, Award } from 'lucide-react';

export const getRankStyles = (index) => {
    switch (index) {
        case 0: return { color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', icon: <Trophy size={24} className="text-yellow-400" /> };
        case 1: return { color: 'text-gray-300', border: 'border-gray-300/50', bg: 'bg-gray-300/10', icon: <Medal size={24} className="text-gray-300" /> };
        case 2: return { color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10', icon: <Medal size={24} className="text-orange-400" /> };
        default: return { color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-gray-900', icon: <Award size={20} className="text-gray-500" /> };
    }
};