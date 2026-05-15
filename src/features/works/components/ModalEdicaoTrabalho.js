'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateWorkAction } from '@/app/actions';
import { StyledInput, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';
import { UploadCloud, FileCheck, CheckCircle2, Edit3 } from 'lucide-react';

const Req = () => <span className="text-red-500 ml-1 font-bold">*</span>;

export default function ModalEdicaoTrabalho({ workData, onFinish, workTypes = [], semester = [] }) {
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
      setTimeout(() => onFinish(), 2000);
    }
  }, [state, onFinish]);

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <CheckCircle2 className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Registo Atualizado!</h2>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-amber-900/30 rounded-full border border-amber-500/30">
            <Edit3 size={28} className="text-amber-400" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200 uppercase tracking-tighter">
          Editar Trabalho
        </h2>
      </div>

      <form action={action} className="space-y-6" encType="multipart/form-data">
        <input type="hidden" name="work_id" value={workData.id} />
        <input type="hidden" name="existing_archive" value={workData.archive} />

        <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-4">
          <div>
            <Label>Assunto / Disciplina <Req /></Label>
            <StyledInput name="disciplina" required defaultValue={workData.subject} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Trabalho <Req /></Label>
              <StyledSelect name="tema" required defaultValue={workData.type}>
                {workTypes.map(type => <option key={type.id} value={type.option}>{type.option}</option>)}
              </StyledSelect>
            </div>

            <div>
              <Label>Nível / Semestre <Req /></Label>
              <StyledSelect name="graduation" required defaultValue={workData.graduation}>
                {semester.map(sem => <option key={sem.id} value={sem.option}>{sem.option}</option>)}
              </StyledSelect>
            </div>
          </div>
        </div>

        <div>
          <Label>Substituir Ficheiro (Opcional)</Label>
          <input type="file" name="arquivo" id="arquivo" className="hidden" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
          <label htmlFor="arquivo" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-500/30 rounded-2xl cursor-pointer bg-gray-900/50 hover:bg-amber-900/20 transition-all group">
            {fileName ? (
              <div className="text-center"><FileCheck size={24} className="text-amber-400 mb-1 mx-auto" /><span className="text-sm font-bold text-white truncate max-w-xs">{fileName}</span></div>
            ) : (
              <div className="text-center"><UploadCloud size={24} className="text-amber-500 mb-1 mx-auto group-hover:scale-110 transition-transform" /><span className="text-xs font-bold text-gray-300">Clique para enviar novo ficheiro</span></div>
            )}
          </label>
        </div>

        <PrimaryButton type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          {isPending ? 'GUARDANDO...' : 'GUARDAR ALTERAÇÕES'}
        </PrimaryButton>
      </form>
    </div>
  );
}