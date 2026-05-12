import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react'; // Trazendo o ícone para manter o padrão

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
    0 0 0 1px rgba(139, 92, 246, 0.1), 
    0 20px 50px -12px rgba(0, 0, 0, 0.8), 
    0 0 30px rgba(139, 92, 246, 0.15); 
  
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  /* Limite seguro de altura para não quebrar a tela */
  max-height: 90vh;
  max-width: ${props => props.$maxWidth || '90%'};
  animation: ${slideUpFade} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden; /* Oculta as bordas, o scroll acontece na div filha */
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
    z-index: 10;
  }

  /* Em telas muito grandes (ultrawide), não queremos que o modal fique gigante */
  @media (min-width: 768px) {
    max-width: ${props => props.$maxWidth || '600px'};
  }
`;

// NOVO: Container responsável apenas por rolar o conteúdo caso passe da tela
const ScrollContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 3rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    padding: 3rem 2rem 2rem 2rem;
  }

  /* Estilização da barra de rolagem (Theme Raid) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.3);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.6);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.2);
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 20;

  &:hover {
    background: rgba(168, 85, 247, 0.2);
    color: #c084fc;
    border-color: #a855f7;
    transform: scale(1.05);
  }
`;

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth,
  closeOnOverlayClick = true
}) {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={() => closeOnOverlayClick && onClose()}>
      <ModalWrapper $maxWidth={maxWidth} onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar">
          <X size={18} strokeWidth={2.5} />
        </CloseButton>
        
        {/* Envolvemos os filhos no container com scroll */}
        <ScrollContainer>
          {children}
        </ScrollContainer>
        
      </ModalWrapper>
    </Backdrop>
  );
}