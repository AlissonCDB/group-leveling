import styled, { keyframes } from 'styled-components';

// Animação de entrada mais suave e futurista
const slideUpFade = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.8); /* Muito escuro, quase preto */
  backdrop-filter: blur(8px); /* Desfoque do fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalWrapper = styled.div`
  /* Fundo Glassmorphism Escuro */
  background: rgba(30, 27, 75, 0.65); 
  backdrop-filter: blur(16px);
  
  padding: 3rem 2.5rem;
  border-radius: 1rem;
  
  /* Borda sutil e brilhante */
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 0 0 1px rgba(139, 92, 246, 0.1), /* Borda interna suave */
    0 20px 50px -12px rgba(0, 0, 0, 0.8), 
    0 0 30px rgba(139, 92, 246, 0.15); /* Glow roxo externo */
    
  position: relative;
  width: 100%;
  max-width: ${props => props.$maxWidth || '450px'};
  animation: ${slideUpFade} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  /* Detalhe estético: Linha brilhante no topo */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #c084fc, transparent);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 20;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;

  &:hover {
    background: rgba(168, 85, 247, 0.2); /* Roxo em vez de vermelho para combinar */
    color: #c084fc;
    border-color: #a855f7;
  }
`;

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth, 
  closeOnOverlayClick = true // Nova prop com valor padrão
}) {
  if (!isOpen) return null;
  
  return (
    <Backdrop onClick={() => closeOnOverlayClick && onClose()}>
      <ModalWrapper $maxWidth={maxWidth} onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar">
          ✕
        </CloseButton>
        {children}
      </ModalWrapper>
    </Backdrop>
  );
}