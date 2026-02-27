'use client';

import { useActionState, useEffect } from 'react';
import { createMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label } from '@/components/UI/Form';

export default function ModalAgendamento({ onFinish }) {
  // useActionState liga o formulário à Server Action de forma automática
  const [state, action, isPending] = useActionState(createMeetingAction, undefined);

  // Fecha o modal apenas se a operação for um sucesso
  useEffect(() => {
    if (state?.success && onFinish) {
      onFinish();
    }
  }, [state, onFinish]);

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
            <StyledInput type="time" name="tempo_estimado" required step="1" />
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

        {state?.message && (
          <p className={`text-center text-[10px] font-bold uppercase tracking-widest mt-2 ${state.success ? 'text-green-400' : 'text-red-400'}`}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}