// components/Navigation/FloatingNav.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, LogOut } from 'lucide-react';
import { ModalOverlay, NavButton } from './NavStyles';
import {logout} from '@/app/actions.js'

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
    { name: 'Home', path: '/home', icon: <Home />, color: 'rgba(100, 100, 100, 0.5)' },
    // Adicione as outras 4 opções aqui...
  ];

  return (
    <>
      {/* Trigger Flutuante (pode ser um Styled Component também!) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-100 p-4 bg-purple-600 rounded-full text-white shadow-lg"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

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