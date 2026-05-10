'use client';

import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';

// Mapeamento central de cores para evitar repetição
const colors = {
  purple: { base: '#a855f7', rgb: '168, 85, 247' },
  blue: { base: '#3b82f6', rgb: '59, 130, 246' },
  amber: { base: '#f59e0b', rgb: '245, 158, 11' },
};

const CardContainer = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  background-color: #111827; /* gray-900 */
  border-radius: 1rem;
  text-align: left;
  transition: all 0.3s ease;
  /* O prefixo $ impede que a prop 'themeColor' seja passada para o HTML */
  border: 1px solid ${props => `rgba(${colors[props.$themeColor].rgb}, 0.3)`};

  &:hover {
    border-color: ${props => colors[props.$themeColor].base};
    box-shadow: 0 0 30px ${props => `rgba(${colors[props.$themeColor].rgb}, 0.2)`};
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => `rgba(${colors[props.$themeColor].rgb}, 0.3)`};
  background-color: ${props => `rgba(${colors[props.$themeColor].rgb}, 0.1)`};
  color: ${props => colors[props.$themeColor].base};
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.1) rotate(-3deg);
    background-color: ${props => `rgba(${colors[props.$themeColor].rgb}, 0.2)`};
  }
`;

const GlowLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: 0;
  background-color: ${props => colors[props.$themeColor].base};
  transition: width 0.5s ease;
  box-shadow: 0 0 10px ${props => colors[props.$themeColor].base};

  ${CardContainer}:hover & {
    width: 50%;
  }
`;

export default function MenuCard({ name, desc, icon: Icon, colorKey, onClick }) {
  return (
    <CardContainer $themeColor={colorKey} onClick={onClick}>
      <div className="flex flex-col items-center text-center">
        <IconWrapper $themeColor={colorKey}>
          <Icon size={24} />
        </IconWrapper>
        
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
          {name}
        </h3>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between w-full pt-4 border-t border-gray-800">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
          Aceder ao Módulo
        </span>
        <ChevronRight size={16} className="text-gray-600 transition-transform group-hover:translate-x-1" />
      </div>

      <GlowLine $themeColor={colorKey} />
    </CardContainer>
  );
}