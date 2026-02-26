'use client';
import { useState, useActionState } from 'react';
import { register } from '@/app/actions';
import { StyledInput, StyledSelect, PrimaryButton, SecondaryButton, Label } from '@/components/UI/Form';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    user_name: '',
    last_name: '',
    id_class: ''
  });
  
  const [state, action, isPending] = useActionState(register, undefined);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validação Passo 1: Email preenchido, senha >= 6 e coincidência de senhas
  const isStep1Valid = 
    formData.email.trim() !== '' &&
    formData.email.includes('@') && 
    formData.password.length >= 6 && 
    formData.password === formData.confirmPassword;

  // Validação Passo 2: Todos os campos de perfil preenchidos
  const isStep2Valid = 
    formData.user_name.trim() !== '' && 
    formData.last_name.trim() !== '' && 
    formData.id_class !== '';

  return (
    <form action={action} className="flex flex-col gap-4 w-full">
      
      {/* INDICADOR DE PROGRESSO */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-gray-800'}`} />
        <div className="mx-4 text-[10px] font-black uppercase tracking-widest text-purple-400">
          Passo {step} de 2
        </div>
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-purple-500 shadow-[0_0_8_#a855f7]' : 'bg-gray-800'}`} />
      </div>

      {/* PASSO 1: CREDENCIAIS */}
      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <Label>Email</Label>
            <StyledInput name="email" type="email" value={formData.email} onChange={handleChange} placeholder="hunter@guilda.com" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Senha</Label>
              <StyledInput name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" required />
            </div>
            <div>
              <Label>Confirmar</Label>
              <StyledInput name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" required />
            </div>
          </div>
          <PrimaryButton 
            type="button" 
            disabled={!isStep1Valid}
            onClick={() => setStep(2)}
            className={!isStep1Valid ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Próximo: Perfil
          </PrimaryButton>
        </div>
      )}

      {/* PASSO 2: PERFIL */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <StyledInput name="user_name" value={formData.user_name} onChange={handleChange} placeholder="Arthur" required />
            </div>
            <div>
              <Label>Sobrenome</Label>
              <StyledInput name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Pendragon" required />
            </div>
          </div>

          <div>
            <Label>Classe</Label>
            <StyledSelect name="id_class" value={formData.id_class} onChange={handleChange} required>
              <option value="" disabled>Selecione sua especialidade</option>
              <option value="1">Guerreiro (Tanker)</option>
              <option value="2">Mago (Data Scientist)</option>
              <option value="3">Arqueiro (Frontend)</option>
              <option value="4">Ladino (Backend)</option>
            </StyledSelect>
          </div>

          {/* BOTÕES LADO A LADO COM MESMO TAMANHO E PADRÃO */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <SecondaryButton type="button" onClick={() => setStep(1)}>
              Voltar
            </SecondaryButton>
            
            <PrimaryButton 
              type="submit" 
              disabled={!isStep2Valid || isPending}
              style={{ marginTop: 0 }}
              className={!isStep2Valid ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isPending ? 'Criando...' : 'Finalizar'}
            </PrimaryButton>
          </div>
        </div>
      )}

      {state?.message && (
        <p className={`${state.success ? 'text-green-400' : 'text-red-400'} text-[10px] font-bold text-center uppercase tracking-widest mt-2 animate-pulse`}>
          {state.message}
        </p>
      )}
    </form>
  );
}