'use client';

import { useActionState, useEffect, useState } from 'react';
import { createMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label } from '@/components/UI/Form';

export default function ModalAgendamento({ onFinish }) {

  const [state, action, isPending] = useActionState(createMeetingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ocultar nav no modal
  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');

    return () => {
      document.documentElement.classList.remove('modal-open-raid');
    };
  }, []);

  useEffect(() => {
    if (state?.success) {
      // Ativa o estado visual de sucesso
      setShowSuccess(true);

      // Aguarda 2 segundos para o usuário ver o feedback e então fecha
      const timer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state, onFinish]);

  // Se a operação foi um sucesso, mostra a tela de "Loot" ou Sucesso
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
          Missão Registrada!
        </h2>
        <p className="text-purple-300 font-medium text-center italic">
          "O farm de hoje será lendário."
        </p>
        <div className="mt-6 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-progress-shrink"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-tighter">
          Nova Raid de Estudo
        </h2>
      </div>

      <form action={action} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Disciplina</Label>
            <StyledInput name="disciplina" placeholder="Ex: Cálculo I" required />
          </div>
          <div>
            <Label>Plataforma</Label>
            <StyledInput name="plataform_meeting" placeholder="Ex: Discord" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data da Meeting</Label>
            <StyledInput type="datetime-local" name="meeting_date" required className="[scheme:dark]" />
          </div>
          <div>
            <Label>Tempo Estimado</Label>
            <StyledInput type="time" name="tempo_estimado" required step="0" defaultValue="01:00" />
          </div>
        </div>

        <div>
          <Label>Conteúdo (Objetivos)</Label>
          <StyledTextArea name="conteudo" rows="3" placeholder="O que será farmado?" required />
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'Sincronizando...' : 'Registrar na Tabela de Missões'}
          </PrimaryButton>
        </div>

        {/* Mensagem de Erro (caso ocorra) */}
        {state?.success === false && state?.message && (
          <p className="text-center text-[10px] font-bold uppercase tracking-widest mt-2 text-red-400">
            ❌ {state.message}
          </p>
        )}
      </form>
    </div>
  );
}