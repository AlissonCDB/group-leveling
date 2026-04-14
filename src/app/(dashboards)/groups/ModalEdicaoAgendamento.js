'use client';

import { useActionState, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { updateMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';

const Req = () => <span className="text-red-500 ml-1 text-lg leading-none">*</span>;

export default function ModalEdicaoAgendamento({ raidData, onFinish }) {
  const [state, action, isPending] = useActionState(updateMeetingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // NOVO ESTADO: Controla se a modal já pode ser renderizada com os dados corretos
  const [isReady, setIsReady] = useState(false);
  
  const [filters, setFilters] = useState({ platforms: [], themes: [], templates: [], categories: [] });

  // Estados para controlar os selects e visibilidade dinâmica
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');
    return () => document.documentElement.classList.remove('modal-open-raid');
  }, []);

  useEffect(() => {
    async function loadFilters() {
      const supabase = createClient();
      const { data, error } = await supabase.from('Filters').select('*');
      
      if (error) {
        console.error("Erro ao carregar filtros:", error);
        setIsReady(true); // Libera a tela mesmo com erro para não ficar travado
        return;
      }

      if (data) {
        const loadedFilters = {
          platforms: data.filter(f => f.category?.trim().toLowerCase() === 'plataform_meeting'),
          themes: data.filter(f => f.category?.trim().toLowerCase() === 'theme'),
          templates: data.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate'),
          categories: data.filter(f => f.category?.trim().toLowerCase() === 'group_category')
        };
        setFilters(loadedFilters);

        // Preencher os selects com os IDs corretos baseados nos nomes que vieram da Raid
        if (raidData) {
            const catId = loadedFilters.categories.find(f => f.option === raidData.group_category?.option)?.id;
            const tplId = loadedFilters.templates.find(f => f.option === raidData.meeting_tamplate?.option)?.id;
            const thmId = loadedFilters.themes.find(f => f.option === raidData.theme?.option)?.id;
            const pltId = loadedFilters.platforms.find(f => f.option === raidData.plataform_meeting?.option)?.id;

            if (catId) setSelectedCategory(catId.toString());
            if (tplId) setSelectedTemplate(tplId.toString());
            if (thmId) setSelectedTheme(thmId.toString());
            if (pltId) setSelectedPlatform(pltId.toString());
        }
        
        // Tudo mapeado, liberta a renderização do formulário!
        setIsReady(true);
      }
    }
    loadFilters();
  }, [raidData]);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => { if (onFinish) onFinish(); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onFinish]);

  const isPresencial = filters.templates
    .find(f => f.id.toString() === selectedTemplate)
    ?.option.toLowerCase().includes('presencial');

  // Formatar a data para o input datetime-local (YYYY-MM-DDThh:mm)
  const formatDateTimeLocal = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 16);
  };

  // TELA DE SUCESSO
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Missão Atualizada!</h2>
      </div>
    );
  }

  // TELA DE CARREGAMENTO (Evita o bug visual)
  if (!isReady) {
      return (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in w-full">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6"></div>
              <p className="text-amber-500 font-black uppercase tracking-[0.2em] text-xs animate-pulse">
                  A Descodificar Missão...
              </p>
          </div>
      );
  }

  // FORMULÁRIO (Só renderiza quando estiver tudo pronto)
  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 uppercase tracking-tighter">
          Editar Raid
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
          Ajustar parâmetros da missão
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="meeting_id" value={raidData?.id || ''} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Categoria da Raid <Req/></Label>
            <StyledSelect name="group_category" required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="" disabled>Ex: Estudos, Eventos...</option>
              {filters.categories.map(f => <option key={f.id} value={f.id}>{f.option}</option>)}
            </StyledSelect>
          </div>
          
          <div>
            <Label className="flex items-center">Tipo de Encontro <Req/></Label>
            <StyledSelect name="meeting_tamplate" required value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="" disabled>Presencial ou Remoto?</option>
              {filters.templates.map(f => <option key={f.id} value={f.id}>{f.option}</option>)}
            </StyledSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Tema / Assunto <Req/></Label>
            <StyledSelect name="theme" required value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
              <option value="" disabled>O que será abordado?</option>
              {filters.themes.map(f => <option key={f.id} value={f.id}>{f.option}</option>)}
            </StyledSelect>
          </div>

          <div className={`${selectedTemplate ? 'block' : 'hidden'}`}>
             <Label className="flex items-center">
                {isPresencial ? 'Endereço do Encontro' : 'Link da Reunião'} <Req/>
             </Label>
             <StyledInput 
                name="adress" 
                defaultValue={raidData?.adress || ''}
                placeholder={isPresencial ? "Ex: Sala 304, Bloco B..." : "Ex: https://meet.google.com/..."} 
                required={!!selectedTemplate} 
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center">Plataforma <Req/></Label>
              <StyledSelect name="plataform_meeting" required value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                {filters.platforms.map(f => <option key={f.id} value={f.id}>{f.option}</option>)}
              </StyledSelect>
            </div>
            <div>
              <Label className="flex items-center">Data <Req/></Label>
              <StyledInput 
                type="datetime-local" 
                name="meeting_date" 
                defaultValue={formatDateTimeLocal(raidData?.meeting_date)}
                required 
                className="[scheme:dark] text-xs" 
              />
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
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'A atualizar...' : 'Guardar Alterações'}
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