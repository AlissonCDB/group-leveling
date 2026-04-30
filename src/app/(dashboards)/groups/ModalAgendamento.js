'use client';

import { useActionState, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { createMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';

// Componente simples para o asterisco vermelho de obrigatório
const Req = () => <span className="text-red-500 ml-1 text-lg leading-none">*</span>;

export default function ModalAgendamento({ onFinish }) {
  const [state, action, isPending] = useActionState(createMeetingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [filters, setFilters] = useState({ platforms: [], themes: [], templates: [], categories: [] });

  // Estados para controlar a exibição dinâmica dos campos
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');
    return () => {
      document.documentElement.classList.remove('modal-open-raid');
    };
  }, []);

  // Busca de opções na tabela Filters com log e fallback de espaços
  useEffect(() => {
    async function loadFilters() {
      const supabase = createClient();
      const { data, error } = await supabase.from('Filters').select('*');
      
      if (error) {
        console.error("Erro ao carregar filtros:", error);
        return;
      }

      if (data) {
        setFilters({
          platforms: data.filter(f => f.category?.trim().toLowerCase() === 'plataform_meeting'),
          themes: data.filter(f => f.category?.trim().toLowerCase() === 'theme'),
          templates: data.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate'),
          categories: data.filter(f => f.category?.trim().toLowerCase() === 'group_category')
        });
      }
    }
    loadFilters();
  }, []);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => { if (onFinish) onFinish(); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onFinish]);

  // Lógica para descobrir se o modelo selecionado é "Presencial"
  const isPresencial = filters.templates
    .find(f => f.id.toString() === selectedTemplate)
    ?.option.toLowerCase().includes('presencial');

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Missão Registrada!</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-tighter">
          Nova Raid
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
          Campos com <span className="text-red-500">*</span> são obrigatórios
        </p>
      </div>

      <form action={action} className="space-y-4">
        
        {/* LINHA 1: Categoria e Tipo de Encontro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center">Categoria da Raid <Req/></Label>
            <StyledSelect 
              name="group_category" 
              required 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Ex: Estudos, Eventos...</option>
              {filters.categories.map(f => (
                <option key={f.id} value={f.id}>{f.option}</option>
              ))}
            </StyledSelect>
          </div>
          
          <div>
            <Label className="flex items-center">Tipo de Encontro <Req/></Label>
            <StyledSelect 
              name="meeting_tamplate" 
              required 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="" disabled>Presencial ou Remoto?</option>
              {filters.templates.map(f => (
                <option key={f.id} value={f.id}>{f.option}</option>
              ))}
            </StyledSelect>
          </div>
        </div>

        {/* LINHA 2: Dinâmica (Tema + Endereço/Link) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* TEMA - Agora sempre visível */}
          <div>
            <Label className="flex items-center">Tema / Assunto <Req/></Label>
            <StyledSelect name="theme" required defaultValue="">
              <option value="" disabled>O que será abordado?</option>
              {filters.themes.map(f => (
                <option key={f.id} value={f.id}>{f.option}</option>
              ))}
            </StyledSelect>
          </div>

          {/* Campo de Endereço ou Link (Muda dinamicamente se escolheu o template) */}
          <div className={`${selectedTemplate ? 'block' : 'hidden'}`}>
             <Label className="flex items-center">
                {isPresencial ? 'Endereço do Encontro' : 'Link da Reunião'} <Req/>
             </Label>
             <StyledInput 
                name="adress" 
                placeholder={isPresencial ? "Ex: Sala 304, Bloco B..." : "Ex: https://meet.google.com/..."} 
                required={!!selectedTemplate} 
             />
          </div>
        </div>

        {/* LINHA 3: Plataforma, Data e Duração */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center">Plataforma <Req/></Label>
              <StyledSelect name="plataform_meeting" required defaultValue="">
                <option value="" disabled>Selecione...</option>
                {filters.platforms.map(f => (
                  <option key={f.id} value={f.id}>{f.option}</option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <Label className="flex items-center">Data <Req/></Label>
              <StyledInput type="datetime-local" name="meeting_date" required className="[scheme:dark] text-xs" />
            </div>
            <div>
              <Label className="flex items-center">Tempo <Req/></Label>
              <StyledInput type="time" name="tempo_estimado" required step="0" defaultValue="01:00" />
            </div>
        </div>

        {/* LINHA 4: Conteúdo */}
        <div>
          <Label className="flex items-center">Conteúdo (Objetivos) <Req/></Label>
          <StyledTextArea name="conteudo" rows="2" placeholder="Descreva os objetivos deste encontro..." required />
        </div>

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'Sincronizando...' : 'Registrar na Tabela de Missões'}
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