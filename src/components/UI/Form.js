import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Label = styled.label`
  color: #c084fc; /* Purple 400 */
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-left: 0.2rem;
  margin-bottom: 0.5rem;
  display: block;
  text-shadow: 0 0 8px rgba(192, 132, 252, 0.4);
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(15, 23, 42, 0.7); 
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Garante que o seletor (pop-up) do sistema também seja dark */
  color-scheme: dark;

  &::placeholder { 
    color: rgba(168, 85, 247, 0.4); 
    font-size: 0.85rem;
  }

  /* Estiliza o ícone do reloginho */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(242deg) brightness(98%) contrast(92%);
    /* O filtro acima transforma o ícone preto em um roxo próximo ao #a855f7 */
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }

  &:focus {
    outline: none;
    background: rgba(24, 24, 27, 0.9);
    border-color: #a855f7;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
    transform: scale(1.01);
  }

  /* Reset Autocomplete */
  &:-webkit-autofill {
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0px 1000px #0f172a inset;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  color: white;
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  cursor: pointer;
  border: none;
  
  /* Estilo RPG: Gradiente de "Energia" */
  background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
  
  /* O Clip-path que você gosta, dá o tom Sci-fi/RPG */
  clip-path: polygon(
    5% 0, 100% 0, 
    100% 70%, 95% 100%, 
    0 100%, 0 30%
  );
  
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    box-shadow: 0 0 25px rgba(139, 92, 246, 0.5);
    transform: translateY(-2px);
    letter-spacing: 0.3em; /* Efeito de expansão no hover */
  }

  &:active:not(:disabled) { 
    transform: scale(0.95); 
  }

  &:disabled { 
    opacity: 0.5;
    filter: grayscale(1);
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: rgba(30, 27, 75, 0.5); 
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #c084fc;
  margin-top: 0; /* Reset para o grid */
  
  &:hover:not(:disabled) {
    background: rgba(46, 16, 101, 0.7);
    color: #ffffff;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
    filter: brightness(1.1);
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(15, 23, 42, 0.7); 
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #ffffff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: none;

  &:focus {
    outline: none;
    background: rgba(24, 24, 27, 0.9);
    border-color: #a855f7;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(15, 23, 42, 0.7); 
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #ffffff;
  font-size: 0.95rem;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
  }

  option {
    background: #0f172a;
    color: white;
  }
`;