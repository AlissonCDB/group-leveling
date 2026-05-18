// src/components/UI/FeedbackToast.js
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FeedbackToast({ message, type = 'success', onClose }) {
    // Fecha automaticamente após 3 segundos
    useEffect(() => {
        if (!message) return;
        
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 ${
            isSuccess 
            ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-400' 
            : 'bg-red-950/95 border-red-500/50 text-red-400'
        }`}>
            {isSuccess ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className="text-xs uppercase font-bold tracking-widest text-white">{message}</span>
            <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X size={16} />
            </button>
        </div>
    );
}