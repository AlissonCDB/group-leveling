// components/Navigation/FloatingNav.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, LogOut, Users, NotebookPen, ArrowBigLeft } from 'lucide-react';
import { ModalOverlay, NavButton, NavsContainer } from './NavStyles';
import { logout } from '@/app/actions.js'

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const handleLogout = async () => {
    // É uma boa prática avisar o usuário ou colocar um loading se quiser
    console.log("Deslogando do Group Leveling...");

    // Chama a Server Action
    await logout();
  };

  const options = [
    { name: 'Início', path: '/home', icon: <Home />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Grupos', path: '/groups', icon: <Users />, color: 'rgba(100, 100, 100, 0.5)' },
    { name: 'Trabalhos', path: '/works', icon: <NotebookPen />, color: 'rgba(100, 100, 100, 0.5)' },
  ];

  return (
    <>
      <NavsContainer id="global-nav-container">
        <button
          onClick={() => router.back()}
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

            <NavButton $glowColor="rgba(244, 63, 94, 0.5)" onClick={handleLogout}>
              <LogOut className="text-rose-500" />
              <span className="text-rose-500 font-bold italic">Sair</span>
            </NavButton>
          </div>
        </ModalOverlay>
      )}
    </>
  );
}