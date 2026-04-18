'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Swords, Briefcase, Trophy, ChevronRight, Power } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('start');
  const router = useRouter();

  // Opções do menu enriquecidas com a nova estética (Ícones, Descrições e Cores específicas)
  const menuOptions = [
    { 
        name: 'Radar de Raids', 
        path: '/groups', 
        icon: Swords,
        desc: 'Agende grupos de estudo, junte-se ao esquadrão e farme conhecimento em equipa.',
        theme: {
            border: 'border-purple-500/30 group-hover:border-purple-400',
            shadow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
            textHover: 'group-hover:text-purple-400',
            bgIcon: 'bg-purple-900/30 text-purple-400 border-purple-500/30',
            line: 'bg-purple-500'
        }
    },
    { 
        name: 'Central de Trabalhos', 
        path: '/works', 
        icon: Briefcase,
        desc: 'Encontre missões académicas, entregue projetos e garanta os seus pontos de XP.',
        theme: {
            border: 'border-blue-500/30 group-hover:border-blue-400',
            shadow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
            textHover: 'group-hover:text-blue-400',
            bgIcon: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
            line: 'bg-blue-500'
        }
    },
    { 
        name: 'Ranqueamento', 
        path: '/ranqueamentos', 
        icon: Trophy,
        desc: 'Acompanhe o seu progresso, compare o seu nível e lute pelo topo da guilda.',
        theme: {
            border: 'border-amber-500/30 group-hover:border-amber-400',
            shadow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
            textHover: 'group-hover:text-amber-400',
            bgIcon: 'bg-amber-900/30 text-amber-400 border-amber-500/30',
            line: 'bg-amber-500'
        }
    },
  ];

  return (
    <div
      className="flex w-screen h-screen bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden font-sans"
      style={{ backgroundImage: "url('/assets/background.png')" }}
    >
      {/* Overlay escuro e blur para dar contraste, idêntico ao painel das Raids */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-6">

        {/* --- TELA 1: PRESS START --- */}
        {currentStep === 'start' && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center">
            
            <div className="mb-12">
                <h2 className="text-purple-400 text-sm font-bold uppercase tracking-[0.5em] mb-2 animate-pulse">
                    Plataforma de Guilda
                </h2>
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                    Bem-Vindo
                </h1>
            </div>

            <button
              onClick={() => setCurrentStep('menu')}
              className="group relative flex flex-col items-center"
            >
              {/* Botão Start Estilizado */}
              <div className="flex items-center gap-3 px-10 py-5 bg-gray-900 border border-purple-500/50 rounded-2xl transition-all duration-300 group-hover:bg-purple-600 group-hover:border-purple-400 group-hover:scale-110 shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]">
                <Power className="text-purple-400 group-hover:text-white transition-colors" size={28} />
                <span className="text-2xl font-black text-white tracking-[0.2em]">
                  PRESS START
                </span>
              </div>
            </button>

            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mt-8 flex items-center gap-2">
               <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span> 
               Sistema Online
            </p>
          </div>
        )}

        {/* --- TELA 2: MENU DE SELEÇÃO --- */}
        {currentStep === 'menu' && (
          <div className="relative w-full max-w-5xl animate-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-12">
                <button
                onClick={() => setCurrentStep('start')}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold group"
                >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Voltar ao Início
                </button>

                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Acesso Autorizado</p>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Painel Principal</h2>
                </div>
            </div>

            {/* Grid dos Cards de Menu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {menuOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => router.push(option.path)}
                    className={`group relative flex flex-col justify-between p-8 bg-gray-900 border rounded-2xl text-left transition-all duration-300 ${option.theme.border} ${option.theme.shadow}`}
                  >
                    <div>
                        {/* Ícone da Seção */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${option.theme.bgIcon}`}>
                            <Icon size={24} />
                        </div>

                        {/* Título e Descrição */}
                        <h3 className={`text-2xl font-black text-white uppercase tracking-tight mb-3 transition-colors ${option.theme.textHover}`}>
                            {option.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            {option.desc}
                        </p>
                    </div>

                    {/* Rodapé do Card (Seta interativa) */}
                    <div className="mt-8 flex items-center justify-between w-full pt-4 border-t border-gray-800">
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest group-hover:text-white transition-colors">
                            Aceder ao Módulo
                        </span>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Linha de destaque no fundo (Glow line) */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 group-hover:w-1/2 rounded-full transition-all duration-500 opacity-50 blur-[2px] ${option.theme.line}`} />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-2px w-0 group-hover:w-1/3 rounded-full transition-all duration-500 delay-75 ${option.theme.line}`} />
                  </button>
                );
              })}
            </div>

            <p className="mt-12 text-center text-gray-600 text-[10px] uppercase tracking-[0.5em]">
              Escolha o seu próximo destino
            </p>
          </div>
        )}
      </div>
    </div>
  );
}