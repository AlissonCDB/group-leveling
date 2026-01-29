'use client';

import { useState, useActionState } from 'react'; // Importamos o hook para lidar com a action
import background from '@/../public/assets/background.png';
import { authenticate } from '@/app/actions'; // Ajuste o caminho para onde salvou a action anterior

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // O hook useActionState recebe a função de login e o estado inicial
  const [state, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div
      className="flex w-screen h-screen bg-gray-900 bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: `url(${background.src || background})` }}
    >
      {!isLoginOpen && (
        <button
          onClick={() => setIsLoginOpen(true)}
          className="absolute bottom-10 right-10 group z-10"
        >
          <div className="relative px-8 py-3 bg-black/60 border-2 border-purple-500 rounded-lg hover:bg-purple-600/80 hover:border-white transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] group-hover:-translate-y-1">
            <span className="text-xl font-bold text-white tracking-[0.2em] animate-pulse">
              PRESS START ▶
            </span>
          </div>
        </button>
      )}

      {/* --- MODAL DE LOGIN --- */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 transition-colors z-20"
            >
              ✕
            </button>

            {/* 1. Adicionamos a 'action' no formulário */}
            <form action={formAction} className="w-full p-8 bg-purple-900/90 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col gap-5 backdrop-blur-md">
              <h2 className="text-3xl font-bold text-white text-center uppercase tracking-widest drop-shadow-md">
                Login
              </h2>

              {/* Exibe mensagem de erro se as credenciais estiverem erradas */}
              {state?.message && (
                <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded border border-red-500/50 text-center">
                  {state.message}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-purple-200 text-xs font-bold uppercase tracking-wider ml-1">E-mail</label>
                <input
                  name="email" // 2. IMPORTANTE: Adicionado o nome do campo
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-purple-500/30 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  placeholder="player1@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-purple-200 text-xs font-bold uppercase tracking-wider ml-1">Senha</label>
                <input
                  name="password" // 3. IMPORTANTE: Adicionado o nome do campo
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-purple-500/30 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                disabled={isPending} // Desabilita enquanto carrega
                className="mt-4 w-full text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all uppercase tracking-wide hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #9333ea, #4f46e5)' }}
              >
                {isPending ? 'Conectando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}