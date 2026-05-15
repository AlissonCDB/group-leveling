'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';

const Req = () => <span className="text-red-500 ml-1 text-lg leading-none">*</span>;

export default function ModalEdicaoAgendamento({ raidData, onFinish, categories = [], templates = [], platforms = [], themes = [] }) {
  const [state, action, isPending] = useActionState(updateMeetingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const initialCat = categories.find(c => c.option === raidData?.group_category?.option)?.id || '';
  const initialTpl = templates.find(t => t.option === raidData?.meeting_tamplate?.option)?.id || '';
  const initialThm = themes.find(t => t.option === raidData?.theme?.option)?.id || '';
  const initialPlat = platforms.find(p => p.option === raidData?.plataform_meeting?.option)?.id || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTpl);
  const [selectedTheme, setSelectedTheme] = useState(initialThm);
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlat);

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

  const isPresencial = templates.find(t => t.id?.toString() === selectedTemplate?.toString())?.option?.toLowerCase().includes('presencial');

  const formatDateTimeLocal = (isoString) => {
      if (!isoString) return '';
      return isoString.substring(0, 16);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Missão Atualizada!</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200 uppercase tracking-tighter">Editar Raid</h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Ajustar parâmetros da missão</p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="meeting_id" value={raidData?.id || ''} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Categoria da Raid <Req/></Label>
            <StyledSelect name="group_category" required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="" disabled>Ex: Estudos, Eventos...</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.option}</option>)}
            </StyledSelect>
          </div>
          
          <div>
            <Label className="flex items-center">Tipo de Encontro <Req/></Label>
            <StyledSelect name="meeting_tamplate" required value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="" disabled>Presencial ou Remoto?</option>
              {templates.map((tpl) => <option key={tpl.id} value={tpl.id}>{tpl.option}</option>)}
            </StyledSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Tema / Assunto <Req/></Label>
            <StyledSelect name="theme" required value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
              <option value="" disabled>O que será abordado?</option>
              {themes.map((thm) => <option key={thm.id} value={thm.id}>{thm.option}</option>)}
            </StyledSelect>
          </div>

          <div className={`${selectedTemplate ? 'block' : 'hidden'}`}>
             <Label className="flex items-center">{isPresencial ? 'Endereço do Encontro' : 'Link da Reunião'} <Req/></Label>
             <StyledInput name="adress" defaultValue={raidData?.adress || ''} required={!!selectedTemplate} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center">Plataforma <Req/></Label>
              <StyledSelect name="plataform_meeting" required={!isPresencial} value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                {platforms.map((plat) => <option key={plat.id} value={plat.id}>{plat.option}</option>)}
              </StyledSelect>
            </div>
            <div>
              <Label className="flex items-center">Data <Req/></Label>
              {/* O VALOR AQUI AGORA VEM LIMPO, CORRIGINDO O BUG DO HORÁRIO */}
              <StyledInput type="datetime-local" name="meeting_date" defaultValue={formatDateTimeLocal(raidData?.meeting_date)} required className="[scheme:dark] text-xs" />
            </div>
            <div>
              <Label className="flex items-center">Tempo <Req/></Label>
              <StyledInput type="time" name="tempo_estimado" required step="0" defaultValue={raidData?.duration || "01:00"} />
            </div>
        </div>

        <div>
          <Label className="flex items-center">Conteúdo (Objetivos) <Req/></Label>
          <StyledTextArea name="conteudo" rows="2" defaultValue={raidData?.content || ''} required />
        </div>

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isPending}>{isPending ? 'A atualizar...' : 'Guardar Alterações'}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}