// components/Navigation/NavStyles.js
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// O Overlay que usa o backdrop-blur do CSS moderno
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  z-index: 90;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

// Botão reutilizável que aceita a cor do gradiente via props
export const NavButton = styled.button`
  position: relative;
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateX(8px);
    background: rgba(255, 255, 255, 0.08);
    
    /* Usando a prop 'color' para o brilho dinâmico */
    box-shadow: 0 0 20px ${(props) => props.$glowColor || 'rgba(168, 85, 247, 0.4)'};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    /* Aqui integramos com o Tailwind v4 se quiser usar as variáveis do tema */
    background: linear-gradient(to right, ${(props) => props.$gradient || 'var(--color-purple-600), var(--color-indigo-600)'});
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.15;
  }
`;