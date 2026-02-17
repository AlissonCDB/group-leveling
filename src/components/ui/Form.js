import styled from 'styled-components';

export const Label = styled.label`
  color: #e9d5ff; /* Roxo claro */
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-left: 0.25rem;
  margin-bottom: 0.25rem;
  display: block;
  text-shadow: 0 0 5px rgba(233, 213, 255, 0.3);
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  
  /* Fundo escuro semi-transparente */
  background: rgba(15, 23, 42, 0.6); 
  
  border-radius: 0.5rem;
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: #f3f4f6;
  font-family: inherit; /* Mantém a fonte do sistema/app */
  transition: all 0.3s ease;

  &::placeholder { 
    color: rgba(148, 163, 184, 0.5); 
    font-size: 0.9rem;
  }

  /* Efeito de foco "Neon" */
  &:focus {
    outline: none;
    background: rgba(15, 23, 42, 0.9);
    border-color: #a855f7;
    box-shadow: 
      0 0 0 1px rgba(168, 85, 247, 0.1),
      0 0 15px rgba(168, 85, 247, 0.25);
    transform: translateY(-1px);
  }
  
  /* Remove o fundo amarelo de autocomplete do Chrome */
  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: #f3f4f6;
    -webkit-box-shadow: 0 0 0px 1000px rgba(15, 23, 42, 0.8) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  position: relative;
  color: white;
  font-weight: 800;
  font-size: 1rem;
  padding: 1rem;
  
  /* Formato Sci-Fi com cantos cortados usando clip-path */
  clip-path: polygon(
    12px 0, 100% 0, 
    100% calc(100% - 12px), calc(100% - 12px) 100%, 
    0 100%, 0 12px
  );
  
  /* Gradiente Vibrante */
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Para garantir que o texto fique acima de pseudo-elementos se houver */
  z-index: 1;

  &:hover:not(:disabled) {
    filter: brightness(1.2);
    transform: translateY(-2px);
    /* Sombra projetada (filter drop-shadow funciona melhor com clip-path) */
    filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.6));
  }

  &:active:not(:disabled) { 
    transform: scale(0.98); 
  }

  &:disabled { 
    opacity: 0.6; 
    filter: grayscale(0.8);
    cursor: not-allowed; 
  }
`;