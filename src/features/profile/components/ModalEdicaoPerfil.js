'use client';

import { useState } from 'react';
import { X, User, Check, Loader2 } from 'lucide-react';

export default function ModalEdicaoPerfil({ isOpen, onClose, currentProfile, onUpdate }) {
    const [formData, setFormData] = useState({
        user_name: currentProfile?.user_name || '',
        last_name: currentProfile?.last_name || '',
        // Se tiver outros campos na tabela User (ex: biografia, github, etc), adicione aqui!
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Passa os dados para a função "pai" fazer o envio
        await onUpdate(formData);
        
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-950 border border-purple-500/30 rounded-2xl w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden">
                
                {/* Cabeçalho */}
                <div className="bg-purple-500/10 p-6 flex flex-col items-center border-b border-purple-500/20 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        <User size={32} className="text-purple-500" />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest text-center">Atualizar Perfil</h2>
                </div>
                
                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Nome</label>
                        <input
                            type="text"
                            required
                            value={formData.user_name}
                            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Sobrenome</label>
                        <input
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Seu sobrenome"
                        />
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Salvar</>}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}