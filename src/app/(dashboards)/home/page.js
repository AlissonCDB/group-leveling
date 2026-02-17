'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Importar o router

export default function Home() {
  const [currentStep, setCurrentStep] = useState('start');
  const router = useRouter(); // 2. Inicializar o router

  // 3. Adicionar a propriedade 'path' em cada opção
  const menuOptions = [
    { name: 'Agendamentos', path: '/groups', color: 'from-purple-600 to-indigo-600' },
    { name: 'Trabalhos', path: '/trabalhos', color: 'from-blue-600 to-cyan-600' },
    { name: 'Minijogos', path: '/minijogos', color: 'from-pink-600 to-rose-600' },
    { name: 'Ranqueamentos', path: '/ranqueamentos', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div
      className="flex w-screen h-screen bg-gray-900 bg-cover bg-bottom bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">

        {currentStep === 'start' && (
          <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-8">
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] uppercase">
              Bem-vindo
            </h1>

            <button
              onClick={() => setCurrentStep('menu')}
              className="group relative"
            >
              <div className="px-12 py-5 bg-purple-600 border-4 border-white rounded-full transition-all duration-300 group-hover:bg-white group-hover:scale-110 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                <span className="text-2xl font-black text-white group-hover:text-purple-600 tracking-[0.3em] animate-pulse">
                  PRESS START
                </span>
              </div>
            </button>

            <p className="text-purple-300/50 font-mono text-sm animate-bounce mt-4">
              ▼ CLIQUE PARA INICIAR ▼
            </p>
          </div>
        )}

        {currentStep === 'menu' && (
          <div className="relative w-full max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
            <button
              onClick={() => setCurrentStep('start')}
              className="absolute -top-12 left-0 text-purple-400 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-bold"
            >
              ◀ Voltar ao início
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuOptions.map((option) => (
                <button
                  key={option.name}
                  // 4. Chamar o router.push para navegar
                  onClick={() => router.push(option.path)}
                  className="group relative overflow-hidden rounded-2xl p-2px transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-linear-to-r ${option.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative bg-gray-900/90 rounded-[14px] py-10 flex flex-col items-center justify-center gap-3 backdrop-blur-md">
                    <span className="text-2xl font-black text-white uppercase tracking-tighter group-hover:tracking-widest transition-all duration-500">
                      {option.name}
                    </span>
                    <div className={`h-1 w-0 group-hover:w-20 bg-linear-to-r ${option.color} transition-all duration-500 rounded-full`} />
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-10 text-center text-white/30 text-[10px] uppercase tracking-[1em]">
              Selecione o seu destino
            </p>
          </div>
        )}
      </div>
    </div>
  );
}