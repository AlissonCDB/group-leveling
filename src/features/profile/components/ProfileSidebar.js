'use client';

import React, { useState } from 'react';
import { User, Shield, MapPin, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { userService } from '@/services/user.service';
import ModalEdicaoPerfil from './ModalEdicaoPerfil';

export default function ProfileSidebar({ profile }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const handleUpdateProfile = async (updatedData) => {
        const supabase = createClient();
        
        // Chama a função de atualização no Service que criámos
        const result = await userService.updateUserProfile(supabase, profile.id, updatedData);

        if (result.success) {
            setIsEditModalOpen(false);
            // Faz o Next.js recarregar a página silenciosamente para buscar os novos dados
            router.refresh(); 
        } else {
            alert("Falha ao atualizar o perfil: " + result.error);
        }
    };

    return (
        <>
            <div className="relative w-full md:w-1/3 h-2/5 md:h-full bg-slate-800 flex flex-col justify-center items-center p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                    <div className="hidden md:flex w-24 h-24 bg-slate-900/50 rounded-full border-2 border-slate-400 items-center justify-center mb-6 shadow-[0_0_30px_rgba(148,163,184,0.3)]">
                        <User size={48} className="text-slate-300" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 drop-shadow-lg">
                        {profile?.user_name} {profile?.last_name}
                    </h1>
                    
                    <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-bold uppercase text-[10px] tracking-widest bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-500/30 shadow-[0_0_15px_rgba(148,163,184,0.1)]">
                        <Shield size={14} />
                        <span>{profile?.Class?.name_class || 'Caçador'}</span>
                    </div>
                    
                    <p className="text-sm text-slate-300 text-center max-w-xs font-medium leading-relaxed mb-8 italic border-l-2 border-slate-500/50 pl-3">
                        "{profile?.Class?.description_class || 'A sua jornada na guilda começou.'}"
                    </p>

                    <div className="flex flex-col items-center mb-8 w-full">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                            <MapPin size={10} /> Afinidade Tech
                        </span>
                        <span className="text-white font-bold">{profile?.Class?.reference_class || 'Geral'}</span>
                    </div>

                    <button 
                        onClick={() => setIsEditModalOpen(true)} 
                        className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white uppercase font-bold tracking-widest transition-colors px-4 py-2 border border-transparent hover:border-slate-500/30 rounded-lg hover:bg-slate-800/50"
                    >
                        <Edit3 size={14} /> Atualizar Nome
                    </button>
                </div>
            </div>

            <ModalEdicaoPerfil 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                currentProfile={profile}
                onUpdate={handleUpdateProfile}
            />
        </>
    );
}