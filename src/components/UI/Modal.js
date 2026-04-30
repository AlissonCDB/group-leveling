import styled, { keyframes } from 'styled-components';

// Animação de entrada mais suave e futurista
const slideUpFade = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;  
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.7);
  backdrop-filter: blur(8px);
  z-index: 50;
`;

const ModalWrapper = styled.div`
  /* Fundo Glassmorphism Escuro */
  background: rgba(30, 27, 75, 0.65); 
  backdrop-filter: blur(16px);
  
  /* Borda sutil e brilhante */
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 0 0 1px rgba(139, 92, 246, 0.1), /* Borda interna suave */
    0 20px 50px -12px rgba(0, 0, 0, 0.8), 
    0 0 30px rgba(139, 92, 246, 0.15); /* Glow roxo externo */
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  width: 100vw;
  height: auto;
  max-height: 90%;
  max-width: ${props => props.$maxWidth || '90%'};
  animation: ${slideUpFade} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  padding: 3rem 1rem;
  border-radius: 1rem;


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

  @media (min-width: 768px) {
    max-width: ${props => props.$maxWidth || '480px'};
    padding: 2rem 2rem;
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

    @media (min-width: 768px) {
      right: 0;
      top: 0.5rem;
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