'use client';

import { useActionState, useEffect, useState } from 'react';
import { publishWorkAction } from '@/app/actions';
import { StyledInput, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';
import { UploadCloud, FileText } from 'lucide-react';

const Req = () => <span className="text-red-500 ml-1 text-lg leading-none">*</span>;

export default function ModalTrabalho({ onFinish }) {
  const [state, action, isPending] = useActionState(publishWorkAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  // Bloqueia o scroll do fundo
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
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Trabalho Enviado!</h2>
        <p className="text-blue-300 font-medium text-center italic">"O seu conhecimento foi adicionado ao arquivo."</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300 uppercase tracking-tighter">
          Novo Trabalho
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
          Campos com <span className="text-red-500">*</span> são obrigatórios
        </p>
      </div>

      <form action={action} className="space-y-4">
        
        <div>
          <Label className="flex items-center">Assunto / Disciplina <Req/></Label>
          <StyledInput 
            name="disciplina" 
            required 
            placeholder="Ex: Engenharia de Software II, Cálculo..." 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Tipo de Trabalho <Req/></Label>
            <StyledSelect name="tema" required defaultValue="">
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
            <StyledSelect name="graduation" required defaultValue="">
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

        {/* UPLOAD DE FICHEIRO ESTILIZADO */}
        <div>
          <Label className="flex items-center">Arquivo a partilhar <Req/></Label>
          <div className="relative">
            <input 
              type="file" 
              name="arquivo" 
              id="arquivo"
              required
              className="hidden"
              onChange={(e) => setFileName(e.target.files[0]?.name || '')}
            />
            <label 
              htmlFor="arquivo"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-500/30 rounded-2xl cursor-pointer bg-gray-900/50 hover:bg-blue-900/20 hover:border-blue-400 transition-all group"
            >
              {fileName ? (
                <div className="flex flex-col items-center text-center">
                    <FileText size={32} className="text-cyan-400 mb-2" />
                    <span className="text-sm font-bold text-white max-w-200px truncate">{fileName}</span>
                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest group-hover:text-cyan-300">Clique para trocar</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                    <UploadCloud size={32} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-gray-300">Clique para anexar ou arraste</span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">PDF, DOCX, ZIP, etc.</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-500">
            {isPending ? 'A Enviar para o Arquivo...' : 'Publicar Trabalho'}
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