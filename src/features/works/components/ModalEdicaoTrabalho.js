'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateWorkAction } from '@/app/actions';
import { StyledInput, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';
import { UploadCloud, FileCheck } from 'lucide-react';

const Req = () => <span className="text-red-500 ml-1 text-lg leading-none">*</span>;

export default function ModalEdicaoTrabalho({ workData, onFinish }) {
  const [state, action, isPending] = useActionState(updateWorkAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');
    return () => document.documentElement.classList.remove('modal-open-raid');
  }, []);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => { if (onFinish) onFinish(); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onFinish]);

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Registo Atualizado!</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200 uppercase tracking-tighter">
          Editar Trabalho
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
          Ajuste as informações ou substitua o ficheiro
        </p>
      </div>

      <form action={action} className="space-y-4">
        {/* Identificador oculto para o backend saber qual registo atualizar */}
        <input type="hidden" name="work_id" value={workData.id} />
        <input type="hidden" name="existing_archive" value={workData.archive} />

        <div>
          <Label className="flex items-center">Assunto / Disciplina <Req/></Label>
          <StyledInput 
            name="disciplina" 
            required 
            defaultValue={workData.subject}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Tipo de Trabalho <Req/></Label>
            <StyledSelect name="tema" required defaultValue={workData.type}>
              <option value="" disabled>Selecione...</option>
              <option value="Resumo">Resumo</option>
              <option value="Artigo">Artigo</option>
              <option value="Apresentação">Apresentação</option>
              <option value="Projeto/Código">Projeto / Código</option>
              <option value="TCC/Monografia">TCC / Monografia</option>
              <option value="Outro">Outro</option>
            </StyledSelect>
          </div>
          
          <div>
            <Label className="flex items-center">Nível / Semestre <Req/></Label>
            <StyledSelect name="graduation" required defaultValue={workData.graduation}>
              <option value="" disabled>Selecione o nível...</option>
              <option value="1º Semestre">1º Semestre</option>
              <option value="2º Semestre">2º Semestre</option>
              <option value="3º Semestre">3º Semestre</option>
              <option value="4º Semestre">4º Semestre</option>
              <option value="5º Semestre">5º Semestre</option>
              <option value="6º Semestre">6º Semestre</option>
              <option value="Geral/Nenhum">Geral / Nenhum</option>
            </StyledSelect>
          </div>
        </div>

        {/* UPLOAD DE FICHEIRO - Opcional na edição */}
        <div>
          <Label className="flex items-center">Substituir Ficheiro (Opcional)</Label>
          <div className="relative">
            <input 
              type="file" 
              name="arquivo" 
              id="arquivo"
              className="hidden"
              onChange={(e) => setFileName(e.target.files[0]?.name || '')}
            />
            <label 
              htmlFor="arquivo"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-500/30 rounded-2xl cursor-pointer bg-gray-900/50 hover:bg-amber-900/20 hover:border-amber-400 transition-all group"
            >
              {fileName ? (
                <div className="flex flex-col items-center text-center">
                    <FileCheck size={24} className="text-amber-400 mb-1" />
                    <span className="text-sm font-bold text-white max-w-200px truncate">{fileName}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                    <UploadCloud size={24} className="text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-300">Clique para enviar um novo ficheiro</span>
                    <span className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">O ficheiro atual será mantido se não enviar outro.</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-500">
            {isPending ? 'A Guardar...' : 'Guardar Alterações'}
          </PrimaryButton>
        </div>

        {state?.success === false && state?.message && (
          <p className="text-center text-[10px] font-bold uppercase tracking-widest mt-2 text-red-400">
            ❌ {state.message}
          </p>
        )}
      </form>
    </div>
  );
}