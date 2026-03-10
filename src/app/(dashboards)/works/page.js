'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; // Importante para o dynamic
import Image from 'next/image';
import Modal from '@/components/UI/Modal';

// Usando dynamic para evitar erros de hidratação/fetch no Turbopack
const ModalTrabalhos = dynamic(() => import('./ModalTrabalhos.js'), { 
  ssr: false 
});

const ModalTrabalhosDisponiveis = dynamic(() => import('./ModalTrabalhosDisponiveis.js'), { 
  ssr: false 
});

export default function TrabalhosPage() {
  const [modalType, setModalType] = useState(null); 

  const closeModal = () => setModalType(null);

  const overlayBoxStyle = "flex flex-col items-center justify-center text-white text-center border-2 border-purple-500/40 rounded-xl p-8 backdrop-blur-sm bg-black/40 transition-all duration-500 group-hover:bg-purple-600/80 group-hover:scale-105 group-hover:border-purple-300 shadow-2xl cursor-pointer";

  return (
    <div className="flex w-screen h-screen relative bg-gray-950 overflow-hidden">
      
      {/* LADO ESQUERDO: VER TRABALHOS DISPONÍVEIS */}
      <button
        onClick={() => setModalType('ver')}
        className="group relative w-1/2 h-full overflow-hidden focus:outline-none"
      >
        <Image
          src="/assets/verTrabalhos.png"
          alt="Ver trabalhos disponíveis"
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={overlayBoxStyle}>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Ver trabalhos disponíveis
            </h2>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-[0.3em]">
              Explorar Oportunidades
            </p>
          </div>
        </div>
      </button>

      {/* LADO DIREITO: ANEXAR TRABALHOS */}
      <button
        onClick={() => setModalType('anexar')}
        className="group relative w-1/2 h-full overflow-hidden focus:outline-none"
      >
        <Image
          src="/assets/anexarTrabalho.png"
          alt="Anexar trabalhos"
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={overlayBoxStyle}>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2 drop-shadow-2xl">
              Anexar trabalhos
            </h2>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-[0.3em]">
              Enviar Novo Arquivo
            </p>
          </div>
        </div>
      </button>

      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent z-20 opacity-50" />

      <Modal 
        isOpen={modalType !== null} 
        onClose={closeModal}
        maxWidth={modalType === 'anexar' ? '600px' : '700px'}
      >
        {modalType === 'anexar' ? (
          <ModalTrabalhos onFinish={closeModal} />
        ) : (
          <ModalTrabalhosDisponiveis />
        )}
      </Modal>
    </div>
  );
}