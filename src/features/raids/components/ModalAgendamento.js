'use client';

import { useActionState, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { createMeetingAction } from '@/app/actions';
import { StyledInput, StyledTextArea, PrimaryButton, Label, StyledSelect } from '@/components/UI/Form';
import { filterService } from '@/services/filter.service';
import { Swords, Users, MapPin, Link, Clock, Calendar, Target, MonitorPlay, CheckCircle2 } from 'lucide-react';

// Componente simples para o asterisco vermelho de obrigatório
const Req = () => <span className="text-red-500 ml-1 font-bold">*</span>;

export default function ModalAgendamento({ onFinish }) {
  const [state, action, isPending] = useActionState(createMeetingAction, undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  const [filters, setFilters] = useState({ platforms: [], themes: [], templates: [], categories: [] });
  const [minDateTime, setMinDateTime] = useState('');

  // Estados para controlar a exibição dinâmica dos campos
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('modal-open-raid');

    // Bloqueia agendamentos no passado pegando a data/hora local atual
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));

    return () => {
      document.documentElement.classList.remove('modal-open-raid');
    };
  }, []);

  useEffect(() => {
    async function loadFilters() {
      const supabase = createClient();
      try {
        const grouped = await filterService.getFiltersGrouped(supabase);
        setFilters(grouped);
      } catch (error) {
        console.error("Erro ao carregar filtros:", error);
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
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Missão Registrada!</h2>
        <p className="text-gray-400 text-sm">Prepare seus equipamentos.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-purple-900/30 rounded-full border border-purple-500/30">
            <Swords size={28} className="text-purple-400" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-tighter">
          Configurar Raid
        </h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 bg-gray-900/50 inline-block px-3 py-1 rounded-full border border-gray-800">
          Campos com <span className="text-red-500 font-bold">*</span> são obrigatórios
        </p>
      </div>

      <form action={action} className="space-y-6">

        {/* BLOCO 1: Informações Base */}
        <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1.5"><Users size={16} className="text-purple-400" /> Categoria <Req /></Label>
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
              <Label className="flex items-center gap-2 mb-1.5"><MonitorPlay size={16} className="text-purple-400" /> Formato <Req /></Label>
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

          <div>
            <Label className="flex items-center gap-2 mb-1.5"><Target size={16} className="text-purple-400" /> Foco da Missão (Tema) <Req /></Label>
            <StyledSelect name="theme" required defaultValue="">
              <option value="" disabled>O que será abordado?</option>
              {filters.themes.map(f => (
                <option key={f.id} value={f.id}>{f.option}</option>
              ))}
            </StyledSelect>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-1.5"><Target size={16} className="text-purple-400" /> Número maximo de participantes <Req /></Label>
            <StyledInput type="number" name="user_limit" required min="1" max="1000" defaultValue="10" />
          </div>
        </div>

        {/* BLOCO 2: Localização e Logística */}
        <div className={`p-4 bg-gray-900/40 border border-gray-800 rounded-xl space-y-4 transition-all ${selectedTemplate ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Esconde plataforma se for presencial */}
            {!isPresencial && (
              <div>
                <Label className="flex items-center gap-2 mb-1.5"><MonitorPlay size={16} className="text-purple-400" /> Plataforma <Req /></Label>
                <StyledSelect name="plataform_meeting" required={!isPresencial} defaultValue="">
                  <option value="" disabled>Onde será?</option>
                  {filters.platforms.map(f => (
                    <option key={f.id} value={f.id}>{f.option}</option>
                  ))}
                </StyledSelect>
              </div>
            )}

            <div className={isPresencial ? "md:col-span-2" : ""}>
              <Label className="flex items-center gap-2 mb-1.5">
                {isPresencial ? <MapPin size={16} className="text-purple-400" /> : <Link size={16} className="text-purple-400" />}
                {isPresencial ? 'Endereço da Base' : 'Link de Acesso'} <Req />
              </Label>
              <StyledInput
                name="adress"
                placeholder={isPresencial ? "Ex: Sala 304, Bloco B..." : "Ex: https://meet.google.com/..."}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1.5"><Calendar size={16} className="text-purple-400" /> Dia e Hora <Req /></Label>
              <StyledInput type="datetime-local" name="meeting_date" required min={minDateTime} className="[scheme:dark] text-xs" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1.5"><Clock size={16} className="text-purple-400" /> Duração Estimada <Req /></Label>
              <StyledInput type="time" name="tempo_estimado" required step="0" defaultValue="01:00" />
            </div>
          </div>
        </div>

        {/* BLOCO 3: Descrição */}
        <div>
          <Label className="flex items-center gap-2 mb-1.5"><Swords size={16} className="text-purple-400" /> Briefing (Objetivos) <Req /></Label>
          <StyledTextArea name="conteudo" rows="3" placeholder="Descreva as metas, requisitos ou preparações para esta run..." required />
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit" disabled={isPending} className="w-full text-lg h-12 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            {isPending ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                SINCRONIZANDO...
              </span>
            ) : 'CRIAR INSTÂNCIA DE RAID'}
          </PrimaryButton>
        </div>

        {state?.success === false && state?.message && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center animate-in shake">
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
              ⚠️ Falha no Sistema: {state.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}