'use client';

import { useState, useActionState } from 'react';
import Image from 'next/image';
import { authenticate, register } from '@/app/actions';

// Import dos seus componentes estilizados
import { StyledInput, PrimaryButton, Label } from '@/components/ui/Form';
import Modal from '@/components/ui/Modal';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Hooks separados para cada ação
  const [loginState, loginAction, isLoginPending] = useActionState(authenticate, undefined);
  const [registerState, registerAction, isRegisterPending] = useActionState(register, undefined);

  // Determina qual estado/ação usar baseado no modo atual
  const state = isRegister ? registerState : loginState;
  const formAction = isRegister ? registerAction : loginAction;
  const isPending = isRegister ? isRegisterPending : isLoginPending;

  return (
    <main className="relative flex w-screen h-screen overflow-hidden items-center justify-center bg-gray-950">
      
      {/* BACKGROUND: Atmosfera de "Dungeon" ou Menu de Jogo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/background.png"
          alt="Cenário do Jogo"
          fill
          priority
          className="object-cover object-center" // Removida a opacidade para o fundo ficar nítido
          quality={90}
        />
        {/* Overlay para dar um tom mais sombrio/RPG */}
        <div className="absolute inset-0 bg-gradient-to-top from-gray-950 via-purple-950/20 to-gray-950/80" />
      </div>

      {/* BOTÃO FLUTUANTE: Estilo "Press Start" */}
      {!isLoginOpen && (
        <button
          onClick={() => setIsLoginOpen(true)}
          className="absolute bottom-10 right-10 group z-10 perspective-1000"
        >
          <div className="
            relative px-10 py-4 
            bg-black/60 backdrop-blur-md 
            border border-purple-500/50 
            rounded-xl overflow-hidden
            shadow-[0_0_20px_rgba(168,85,247,0.3)] 
            group-hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] 
            group-hover:border-purple-400
            group-hover:-translate-y-1 
            transition-all duration-300 ease-out
          ">
            <div className="absolute top-0 -left-[full] w-full h-full bg-gradient-to-right from-transparent via-white/10 to-transparent group-hover:animate-shine" />
            
            <span className="text-2xl font-black text-white tracking-[0.25em] drop-shadow-md flex items-center gap-3">
              INICIAR <span className="animate-pulse text-purple-400">▶</span>
            </span>
          </div>
        </button>
      )}

      {/* MODAL DE LOGIN */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <form action={formAction} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
          
          <div className="text-center space-y-2 mb-2">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-right from-white to-purple-400 uppercase tracking-widest[0.10em] drop-shadow-lg">
              {isRegister ? 'Novo Caçador' : 'Group Leveling'}
            </h2>
            {/* Subtítulo Contextual */}
            <p className="text-xs text-purple-300/70 tracking-widest uppercase border-b border-purple-500/20 pb-4">
              {isRegister ? 'Junte-se à guilda e comece sua jornada.' : 'Upar sozinho farma aura, mas em grupo é mais rapida.'}
            </p>
          </div>

          {state?.message && (
            <div className={`text-sm p-3 rounded-lg border text-center animate-shake backdrop-blur-sm flex items-center justify-center gap-2 ${
              state.success 
                ? 'bg-green-950/50 border-green-500/40 text-green-300' 
                : 'bg-red-950/50 border-red-500/40 text-red-300'
            }`}>
              {state.success ? '✅' : '⚠️'} {state.message}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex flex-col gap-2 group">
              <Label className="text-purple-200 group-focus-within:text-purple-400 transition-colors">
                Email do Caçador (Aluno)
              </Label>
              <StyledInput 
                name="email" 
                type="email" 
                placeholder="player1@email.com" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2 group">
              <Label className="text-purple-200 group-focus-within:text-purple-400 transition-colors">
                Senha de Acesso
              </Label>
              <StyledInput 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
              />
            </div>

            {isRegister && (
              <div className="flex flex-col gap-2 group animate-fadeIn">
                <Label className="text-purple-200 group-focus-within:text-purple-400 transition-colors">
                  Confirmar Senha
                </Label>
                <StyledInput 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <PrimaryButton type="submit" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isRegister ? 'Criando conta...' : 'Conectando...'}
                </span>
              ) : (isRegister ? 'Criar Conta' : 'Entrar na Party')}
            </PrimaryButton>

            <button 
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                // Limpar estados de erro ao trocar de tela seria ideal, mas requer resetar o hook ou ignorar o state antigo
              }}
              className="text-xs text-purple-300 hover:text-white transition-colors underline decoration-purple-500/50 hover:decoration-purple-400"
            >
              {isRegister ? 'Já tem uma conta? Faça Login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}