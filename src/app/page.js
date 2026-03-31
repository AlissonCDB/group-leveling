'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/UI/Modal';
import AuthContainer from '@/components/Authentication/AuthContainer';
import { PrimaryButton } from '@/components/UI/Form';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false); 

  return (
    <main className="relative flex w-screen h-screen overflow-hidden items-center justify-center bg-gray-950">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/background.png"
          alt="Cenário do Jogo"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-purple-950/20 to-gray-950/80" />
      </div>

      {/* BOTÃO FLUTUANTE PADRONIZADO */}
      {!isLoginOpen && (
        <div className="absolute bottom-10 right-10 z-10 w-auto sm-flex sm-justify-end sm-items-center">
          <PrimaryButton 
            onClick={() => setIsLoginOpen(true)}
            style={{ width: 'auto', padding: '1rem 2.5rem', marginTop: 0 }}
          >
            <span className="text-2xl font-black text-white tracking-[0.25em] flex items-center gap-3">
              INICIAR
            </span>
          </PrimaryButton>
        </div>
      )}

      {/* MODAL NÃO PERMITE FECHAR CLICANDO FORA NO MOMENTO DO CADASTRO*/}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        closeOnOverlayClick={!isRegister} //
      >
        <AuthContainer isRegister={isRegister} setIsRegister={setIsRegister} />
      </Modal>
    </main>
  );
}