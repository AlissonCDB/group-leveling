'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { register } from '@/app/actions';
import { classService } from '@/services/class.service';
import { StyledInput, StyledSelect, PrimaryButton, SecondaryButton, Label } from '@/components/UI/Form';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    user_name: '',
    last_name: '',
    id_class: ''
  });

  const [state, action, isPending] = useActionState(register, undefined);

  useEffect(() => {
    classService.getAllClasses()
      .then(setClasses)
      .catch((err) => console.error("Erro ao carregar afinidades:", err));
  }, []);

  const selectedClass = useMemo(() =>
    classes.find(c => c.id.toString() === formData.id_class),
    [classes, formData.id_class]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validações de progresso
  const isStep1Valid =
    formData.email.trim() !== '' &&
    formData.email.includes('@') &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  const isStep2Valid =
    formData.user_name.trim() !== '' &&
    formData.last_name.trim() !== '' &&
    formData.id_class !== '';

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-fade-in text-center">
        <div className="space-y-2">
          <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Classe Desbloqueada
          </h3>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {selectedClass?.name_class || 'Caçador'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-purple-500/50" />
            <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">
              {selectedClass?.reference_class}
            </span>
            <div className="h-px w-8 bg-purple-500/50" />
          </div>
        </div>

        {/* TEXTO DE JUSTIFICATIVA (Lore da Classe) */}
        <div className="relative px-6 py-4 bg-purple-950/20 border border-purple-500/20 rounded-lg max-w-[320px]">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500" />

          <p className="text-purple-100/90 text-xs italic leading-relaxed">
            "{selectedClass?.description_class || 'Sua jornada na guilda começa agora.'}"
          </p>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent my-2" />

        {/*<p className="text-[10px] text-green-400 font-bold uppercase tracking-widest animate-pulse">
          Sua conta foi criada. Verifique seu e-mail para despertar!
        </p> */ }
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 w-full">

      {/* INDICADOR DE PROGRESSO */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-gray-800'}`} />
        <div className="mx-4 text-[10px] font-black uppercase tracking-widest text-purple-400">Passo {step} de 2</div>
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-gray-800'}`} />
      </div>

      {/* A MUDANÇA ESTÁ AQUI: 
        Usamos CSS (hidden) em vez de condicionais do React (step === 1 && ...)
        Isso mantém os inputs no DOM para que a Server Action receba os dados.
      */}

      {/* CONTEÚDO PASSO 1 */}
      <div className={`space-y-4 animate-slide-up ${step !== 1 ? 'hidden' : 'block'}`}>
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
        <PrimaryButton type="button" disabled={!isStep1Valid} onClick={() => setStep(2)}>
          Próximo: Afinidade
        </PrimaryButton>
      </div>

      {/* CONTEÚDO PASSO 2 */}
      <div className={`space-y-4 animate-fade-in ${step !== 2 ? 'hidden' : 'block'}`}>
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
          <Label>Sua Afinidade Tech</Label>
          <StyledSelect name="id_class" value={formData.id_class} onChange={handleChange} required>
            <option value="" disabled>Qual sua área de domínio?</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.reference_class}</option>
            ))}
          </StyledSelect>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <SecondaryButton type="button" onClick={() => setStep(1)}>Voltar</SecondaryButton>
          <PrimaryButton type="submit" disabled={!isStep2Valid || isPending} style={{ marginTop: 0 }}>
            {isPending ? 'Criando...' : 'Despertar'}
          </PrimaryButton>
        </div>
      </div>

      {state?.message && !state.success && (
        <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest mt-2 animate-pulse">
          {state.message}
        </p>
      )}
    </form>
  );
}