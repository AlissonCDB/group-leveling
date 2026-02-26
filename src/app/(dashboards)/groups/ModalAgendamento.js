'use client'

import { useState } from 'react'
import { StyledInput, StyledTextArea, PrimaryButton, Label } from '@/components/UI/Form'

export default function ModalAgendamento({ onFinish }) {
  // Estado ajustado para bater com as colunas do seu diagrama (Meeting)
  const [formData, setFormData] = useState({
    meeting_date: '',
    plataform_meeting: '',
    disciplina: '',
    conteudo: '',
    tempo_estimado: '' // Mapeado de 'tempo estimado' do diagrama
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // O campo 'creator' (id_user) e 'created_at' devem ser tratados 
    // preferencialmente na sua Server Action para segurança.
    console.log("Dados da Raid para o Supabase:", formData);
    
    if (onFinish) onFinish();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-tighter">
          Nova Raid de Estudo
        </h2>
        <p className="text-xs text-purple-300/60 uppercase tracking-widest mt-1">
          Sincronizando com a base de dados de Missões
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Disciplina</Label>
            <StyledInput 
              name="disciplina"
              placeholder="Ex: Cálculo I"
              value={formData.disciplina}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Plataforma</Label>
            <StyledInput 
              name="plataform_meeting"
              placeholder="Ex: Discord ou Meet"
              value={formData.plataform_meeting}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data da Meeting</Label>
            <StyledInput 
              type="datetime-local" 
              name="meeting_date"
              value={formData.meeting_date}
              onChange={handleChange}
              required
              className="[scheme:dark]"
            />
          </div>
          <div>
            <Label>Tempo Estimado</Label>
            <StyledInput 
              type="time" // Definido como 'time' conforme seu diagrama
              name="tempo_estimado"
              value={formData.tempo_estimado}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label>Conteúdo (Objetivos)</Label>
          <StyledTextArea 
            name="conteudo"
            rows="3"
            placeholder="Descreva o que será farmado nesta raid..."
            value={formData.conteudo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pt-4">
          <PrimaryButton type="submit">
            Registrar na Tabela de Missões
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}