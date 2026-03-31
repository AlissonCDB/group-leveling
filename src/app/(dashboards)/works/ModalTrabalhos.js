'use client';

import { useActionState, useEffect } from 'react';
import { publishWorkAction } from '@/app/actions'; 
import { StyledInput, StyledTextArea, PrimaryButton, Label } from '@/components/UI/Form';

export default function ModalTrabalhos({ onFinish }) {
  // Conecta o formulário à função de publicação do banco 'Work'
  const [state, action, isPending] = useActionState(publishWorkAction, undefined);

  useEffect(() => {
    // Se a action retornar sucesso, aguarda um pouco e fecha o modal
    if (state?.success && onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onFinish]);

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-tighter">
          Anexar Novo Trabalho
        </h2>
        <div className="h-1 w-20 bg-purple-600 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        <p className="text-purple-300/60 text-[10px] font-mono mt-3 uppercase tracking-widest italic">
          Upload de artefatos para o arquivo da guilda
        </p>
      </div>

      {/* O Next.js gerencia o envio de arquivos automaticamente via Server Actions */}
      <form action={action} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Disciplina</Label>
            <StyledInput 
              name="disciplina" 
              placeholder="Ex: Banco de Dados" 
              required 
            />
          </div>
          <div>
            <Label>Tema</Label>
            <StyledInput 
              name="tema" 
              placeholder="Ex: Modelagem SQL" 
              required 
            />
          </div>
        </div>

        <div>
          <Label>Arquivo do Trabalho</Label>
          <div className="relative group">
            <input 
              type="file" 
              name="arquivo" 
              required 
              accept=".pdf,.docx,.zip,.jpg,.png"
              className="w-full text-sm text-purple-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-black file:uppercase
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-500 file:transition-all
                cursor-pointer bg-gray-800/50 p-2 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            />
          </div>
          <p className="text-[9px] text-purple-400/50 mt-2 uppercase tracking-widest italic text-center">
            PDF, DOCX, ZIP, IMAGENS (MÁX 10MB)
          </p>
        </div>

        <div>
          <Label>Observações (Opcional)</Label>
          <StyledTextArea 
            name="graduation" 
            rows={3} 
            placeholder="Algum detalhe importante sobre o envio?" 
          />
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="animate-spin text-lg">⏳</span> PROCESSANDO...
              </span>
            ) : (
              'PUBLICAR NO ARQUIVO'
            )}
          </PrimaryButton>
        </div>

        {/* FEEDBACK DE STATUS */}
        {state?.message && (
          <div className={`p-3 rounded-lg border text-center animate-in slide-in-from-top-2 duration-300 ${
            state.success 
              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {state.success ? '✅ ' : '❌ '} {state.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}