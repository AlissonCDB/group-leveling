'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Briefcase, Trophy, Power } from 'lucide-react';
import Image from 'next/image';
import MenuCard from '@/components/View/HomeCard';

// Certifique-se que o caminho do import está correto (UI ou View)
import PendingRatingsAlert from '@/components/View/PendingRatingsAlert';

const MENU_OPTIONS = [
  {
    name: 'Radar de Raids',
    path: '/groups',
    icon: Swords,
    colorKey: 'purple',
    desc: 'Agende grupos de estudo, junte-se ao esquadrão e farme conhecimento em equipa.',
  },
  {
    name: 'Central de Trabalhos',
    path: '/works',
    icon: Briefcase,
    colorKey: 'blue',
    desc: 'Encontre missões académicas, entregue projetos e garanta os seus pontos de XP.',
  },
  {
    name: 'Ranqueamento',
    path: '/ranks',
    icon: Trophy,
    colorKey: 'amber',
    desc: 'Acompanhe o seu progresso, compare o seu nível e lute pelo topo da guilda.',
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState('start');
  const router = useRouter();

  return (
    <div className="flex w-screen h-screen">
      
      {/* Background Section */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/assets/background.png"
          alt="Cenário do Jogo"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute h-full inset-0 bg-linear-to-t from-gray-950 via-purple-950/20 to-gray-950/80" />
      </div>

      <div className="fixed inset-0 h-full bg-black/20 md:bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center px-6">

        {/* TELA 1: PRESS START */}
        {currentStep === 'start' && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center">
            <div className="mb-12">
              <h2 className="text-purple-400 text-sm font-bold uppercase tracking-[0.5em] mb-2 animate-pulse">
                Plataforma da Guilda
              </h2>
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Bem-Vindo
              </h1>
            </div>

            <button
              onClick={() => setCurrentStep('menu')}
              className="group flex items-center gap-3 px-10 py-5 bg-gray-900 border border-purple-500/50 rounded-2xl transition-all duration-300 hover:bg-purple-600 hover:scale-110 shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]"
            >
              <Power className="text-purple-400 group-hover:text-white" size={28} />
              <span className="text-2xl font-black text-white tracking-[0.2em]">PRESS START</span>
            </button>
          </div>
        )}

        {/* TELA 2: MENU DE SELEÇÃO */}
        {currentStep === 'menu' && (
          <>
            {/* 🔴 O ALERTA AGORA SÓ É CARREGADO NESTA SEQUÊNCIA */}
            <PendingRatingsAlert />

            <div className="flex w-full max-w-5xl h-full flex-col items-center justify-start md:justify-center pt-12 pb-12 md:py-0 overflow-y-auto scrollbar-hide animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="text-center md:text-left w-full mb-12 shrink-0">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Acesso Autorizado</p>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Painel Principal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full shrink-0">
                {MENU_OPTIONS.map((option) => (
                  <MenuCard
                    key={option.name}
                    {...option}
                    onClick={() => router.push(option.path)}
                  />
                ))}
              </div>

              <p className="mt-12 text-gray-600 text-[10px] uppercase tracking-[0.5em] shrink-0">
                Escolha o seu próximo destino
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}