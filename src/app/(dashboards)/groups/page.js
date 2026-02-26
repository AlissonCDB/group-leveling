'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/UI/Modal';
import ModalAgendamento from './ModalAgendamento.js';
import ListagemRaids from './_components/ListagemRaids';

export default function GroupsPage() {
  const [modalType, setModalType] = useState(null); // 'agendar' | 'ativas' | null

  const closeModal = () => setModalType(null);

  const overlayBoxStyle = "flex flex-col items-center justify-center text-white text-center border-2 border-purple-500/40 rounded-xl p-8 backdrop-blur-sm bg-black/40 transition-all duration-500 group-hover:bg-purple-600/80 group-hover:scale-105 group-hover:border-purple-300 shadow-2xl";

  return (
    <div className="flex w-screen h-screen relative bg-gray-950 overflow-hidden">
      
      {/* LADO ESQUERDO: BUSCAR RAIDS */}
      <button
        onClick={() => setModalType('ativas')}
        className="group relative w-1/2 h-full overflow-hidden focus:outline-none"
      >
        <Image
          src="/assets/entrarGrupo.png"
          alt="Buscar Raids"
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={overlayBoxStyle}>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Raids Ativas
            </h2>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-[0.3em]">
              Explorar Guildas
            </p>
          </div>
        </div>
      </button>

      {/* LADO DIREITO: CRIAR RAID */}
      <button
        onClick={() => setModalType('agendar')}
        className="group relative w-1/2 h-full overflow-hidden focus:outline-none"
      >
        <Image
          src="/assets/criarGrupo.png"
          alt="Agendar Raid"
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={overlayBoxStyle}>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Agendar Raid
            </h2>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-[0.3em]">
              Nova Missão
            </p>
          </div>
        </div>
      </button>

      {/* DIVISOR NEON CENTRAL */}
      <div className="absolute left-1/2 top-0 h-full w-1px bg-linear-to-b from-transparent via-purple-500 to-transparent z-20 opacity-50" />

      {/* MODAL UNIFICADO */}
      <Modal 
        isOpen={modalType !== null} 
        onClose={closeModal}
        maxWidth={modalType === 'agendar' ? '600px' : '480px'}
      >
        {modalType === 'agendar' ? (
          <ModalAgendamento onFinish={closeModal} />
        ) : (
          <ListagemRaids />
        )}
      </Modal>
    </div>
  );
}