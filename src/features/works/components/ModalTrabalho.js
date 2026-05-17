'use client';

import { useActionState, useEffect, useState } from 'react';
import { publishWorkAction } from '@/app/actions';
import { StyledInput, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';
import { UploadCloud, FileText, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';

const Req = () => <span className="text-red-500 ml-1 font-bold">*</span>;

export default function ModalTrabalho({ onFinish, workTypes = [], semester = [] }) {
  const [state, action, isPending] = useActionState(publishWorkAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');
    return () => document.documentElement.classList.remove('modal-open-raid');
  }, []);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      setTimeout(() => onFinish(), 2000);
    }
  }, [state, onFinish]);

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <CheckCircle2 className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Arquivo Enviado!</h2>
        <p className="text-blue-300 italic text-sm">"O conhecimento da Guilda aumentou."</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-blue-900/30 rounded-full border border-blue-500/30">
            <Briefcase size={28} className="text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-blue-400 uppercase tracking-tighter">
          Novo Trabalho
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 bg-gray-900/50 inline-block px-3 py-1 rounded-full border border-gray-800">
          Campos com <span className="text-red-500 font-bold">*</span> são obrigatórios
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-1.5"><FileText size={16} className="text-blue-400" /> Assunto / Disciplina <Req /></Label>
            <StyledInput name="disciplina" required placeholder="Ex: Engenharia de Software II..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1.5"><Briefcase size={16} className="text-blue-400" /> Tipo <Req /></Label>
              <StyledSelect name="tema" required defaultValue="">
                <option value="" disabled>Selecione...</option>
                {workTypes.map(type => <option key={type.id} value={type.id}>{type.option}</option>)}
              </StyledSelect>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-1.5"><GraduationCap size={16} className="text-blue-400" /> Semestre <Req /></Label>
              <StyledSelect name="graduation" required defaultValue="">
                <option value="" disabled>Selecione...</option>
                {semester.map(sem => <option key={sem.id} value={sem.id}>{sem.option}</option>)}
              </StyledSelect>
            </div>
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-1.5"><UploadCloud size={16} className="text-blue-400" /> Arquivo <Req /></Label>
          <input type="file" name="arquivo" id="arquivo" className="hidden" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
          <label htmlFor="arquivo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-500/30 rounded-2xl cursor-pointer bg-gray-900/50 hover:bg-blue-900/20 hover:border-blue-400 transition-all group">
            {fileName ? (
              <div className="text-center"><FileText size={32} className="text-blue-400 mb-2 mx-auto" /><span className="text-sm font-bold text-white block truncate max-w-xs">{fileName}</span></div>
            ) : (
              <div className="text-center"><UploadCloud size={32} className="text-blue-500 mb-2 mx-auto group-hover:scale-110 transition-transform" /><span className="text-sm font-bold text-gray-300">Anexar material de estudo</span></div>
            )}
          </label>
        </div>

        {state?.success === false && state?.message && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center animate-in shake">
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
              Falha no Sistema: {state.message}
            </p>
          </div>
        )}

        <PrimaryButton type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          {isPending ? 'SINCRONIZANDO...' : 'PUBLICAR TRABALHO'}
        </PrimaryButton>
      </form>
    </div>
  );
}