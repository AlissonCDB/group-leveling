'use client';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthContainer({ isRegister, setIsRegister }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-purple-400 uppercase tracking-widest drop-shadow-lg">
          {isRegister ? 'Novo Caçador' : 'Group Leveling'}
        </h2>
        <p className="text-xs text-purple-300/70 tracking-widest uppercase border-b border-purple-500/20 pb-4">
          {isRegister
            ? 'Junte-se à guilda e comece sua jornada.'
            : 'Upar sozinho faz você farmar aura, mas upar em grupo faz você farmar experiência.'}
        </p>
      </div>

      {/* Renderização Condicional do Formulário */}
      {isRegister ? <RegisterForm /> : <LoginForm />}

      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        className="text-xs text-center text-purple-300 hover:text-white transition-colors underline decoration-purple-500/50"
      >
        {isRegister ? 'Já tem uma conta? Faça Login' : 'Não tem conta? Cadastre-se'}
      </button>
    </div>
  );
}