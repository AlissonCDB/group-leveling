'use client';

import { useState } from 'react';
// 🔴 IMPORTANTE: Adicionámos o usePathname aqui
import { useRouter, usePathname } from 'next/navigation'; 
import { Menu, X, Home, LogOut, Users, NotebookPen, ArrowBigLeft, User, AlertTriangle } from 'lucide-react';
import { ModalOverlay, NavButton, NavsContainer } from './NavStyles';
import { logout } from '@/app/actions.js'

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname(); // 🔴 Descobre em qual ecrã estamos agora
  
  const handleLogout = async () => {
    console.log("Deslogando do Group Leveling...");
    await logout();
  };

  // 🔴 NOVA FUNÇÃO: Controla o que o botão de voltar faz
  const handleBackClick = () => {
    // Se estiver na Home, impede de voltar para o login direto e mostra o modal
    if (pathname === '/home') {
      setShowLogoutConfirm(true);
    } else {
      // Se estiver em qualquer outra página, volta normalmente
      router.back();
    }
  };

  const options = [
    { name: 'Início', path: '/home', icon: <Home />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Grupos', path: '/groups', icon: <Users />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Trabalhos', path: '/works', icon: <NotebookPen />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Ranks', path: '/ranks', icon: <NotebookPen />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Perfil', path: '/profile', icon: <User />, color: 'rgba(100, 100, 100, 0.5)' },
  ];

  return (
    <>
      <NavsContainer id="global-nav-container">
        {/* 🔴 O botão de voltar agora usa a nossa função intercetadora */}
        <button
          onClick={handleBackClick}
          className='hidden md:block cursor-pointer border-white border rounded-full p-2'
        >
          <ArrowBigLeft />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='cursor-pointer border-white border rounded-full p-2'
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </NavsContainer>

      {/* MENU PRINCIPAL */}
      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-sm p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((opt) => (
              <NavButton
                key={opt.name}
                $glowColor={opt.color}
                onClick={() => {
                  router.push(opt.path);
                  setIsOpen(false);
                }}
              >
                {opt.icon}
                <span className="font-bold uppercase tracking-widest">{opt.name}</span>
              </NavButton>
            ))}

            <NavButton 
              $glowColor="rgba(244, 63, 94, 0.5)" 
              onClick={() => {
                setIsOpen(false); 
                setShowLogoutConfirm(true); 
              }}
            >
              <LogOut className="text-rose-500" />
              <span className="text-rose-500 font-bold italic">Sair</span>
            </NavButton>
          </div>
        </ModalOverlay>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-rose-500/30 rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center shadow-[0_0_40px_rgba(244,63,94,0.15)]">
            
            <AlertTriangle size={48} className="text-rose-500 mb-4 opacity-80" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Sair da Guilda?</h2>
            <p className="text-sm text-gray-400 mb-8">Tem certeza que deseja encerrar a sua sessão agora?</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}