import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const HeaderGroup = styled.div`
  text-align: center;
  width: 100%;
  flex-shrink: 0;
  
  /* Resolve o problema do espaçamento alterando a tela: */
  /* Mantém uma altura mínima para que o layout não "quique" quando o texto quebra */
  min-height: 90px; 
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    text-align: left;
    width: 250px; /* Largura fixa no desktop para o texto não empurrar os filtros */
    min-height: auto;
  }
`;

export const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  line-height: 1.1; /* Melhora a estética quando o texto quebra */
  
  /* Força a quebra de texto */
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const Subtitle = styled.p`
  font-size: 10px;
  font-weight: bold;
  color: #60a5fa; /* blue-400 */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
`;

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

export const ExpandableArea = styled.div`
  position: relative;
  overflow: hidden;
  /* Reduzimos de 0.5s para 0.4s e usamos uma curva mais rápida no fechamento */
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  width: 100%;

  /* O segredo do delay: 
     Reduzimos de 1000px para 500px. 
     Se o conteúdo tem 300px, o 'delay' invisível será muito menor.
  */
  max-height: ${({ $isExpanded }) => ($isExpanded ? '600px' : '160px')};

  @media (min-width: 640px) {
    width: auto;
  }
`;

export const FilterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`;

export const FilterCard = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  color: white;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0.5rem;
  background-color: #111827; /* gray-900 */
  padding: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);

  @media (min-width: 768px) {
    width: 49%;
  }
`;

export const FilterLabel = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 0.25rem;
  width: 100%;
  
  /* Lógica para adicionar as bordas coloridas internas do Filtro 2 e 3 */
  padding: ${({ $borderColor }) => ($borderColor ? '0.25rem' : '0')};
  border-radius: ${({ $borderColor }) => ($borderColor ? '0.75rem' : '0')};
  background-color: ${({ $borderColor }) => ($borderColor ? '#111827' : 'transparent')};
  border: ${({ $borderColor }) => {
    if ($borderColor === 'amber') return '1px solid rgba(245, 158, 11, 0.2)'; // amber-500/20
    if ($borderColor === 'purple') return '1px solid rgba(168, 85, 247, 0.2)'; // purple-500/20
    return 'none';
  }};
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex: 1;

  @media (min-width: 640px) {
    flex: none;
  }

  /* Controle de Cores Baseado na Prop transiente $colorType */
  background-color: ${({ $active, $colorType }) => {
    if (!$active) return 'transparent';
    switch ($colorType) {
      case 'cyan': return '#0891b2'; // cyan-600
      case 'amber': return '#d97706'; // amber-600
      case 'purple': return '#9333ea'; // purple-600
      case 'emerald': return '#059669'; // emerald-600
      case 'gray-shadow': return '#374151'; // gray-700
      case 'blue-shadow':
      case 'blue':
      default: return '#2563eb'; // blue-600
    }
  }};

  /* Efeitos de Sombra de brilho para os botões do Histórico */
  box-shadow: ${({ $active, $colorType }) => {
    if (!$active) return 'none';
    if ($colorType === 'blue-shadow') return '0 0 15px rgba(37,99,235,0.4)';
    if ($colorType === 'gray-shadow') return '0 0 15px rgba(55,65,81,0.4)';
    return 'none';
  }};
      
  color: ${({ $active }) => ($active ? 'white' : '#9ca3af')};

  &:hover {
    color: white;
    background-color: ${({ $active }) => ($active ? '' : '#1f2937')};
  }
`;

export const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  pointer-events: none;
`;

export const ToggleButton = styled.button`
  font-size: 11px;
  font-weight: bold;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background-color: rgba(59, 130, 246, 0.05);

  &:hover {
    color: white;
    background-color: rgba(59, 130, 246, 0.2);
  }

  span {
    font-size: 1.125rem;
  }
`;