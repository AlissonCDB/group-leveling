import React from 'react';
import styled, { css } from 'styled-components';

// 1. O Recipiente Principal
export const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: #111827;
  border: 1px solid;
  border-radius: 1rem;
  transition: all 300ms ease-in-out;
  height: 100%; /* Garante que os cartões esticam no grid */

  ${({ $isPast, $variant }) => {
    if ($isPast) return css`
      opacity: 0.7;
      filter: grayscale(0.3);
      border-color: rgba(168, 85, 247, 0.3);
      &:hover { opacity: 1; }
    `;
    if ($variant === 'highlight') return css`
      border-color: rgba(245, 158, 11, 0.5);
      &:hover {
        border-color: rgba(251, 191, 36, 1);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
      }
    `;
    return css`
      border-color: rgba(168, 85, 247, 0.3);
      &:hover {
        border-color: rgba(192, 132, 252, 1);
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
      }
    `;
  }}
`;

// 2. O Cabeçalho Padrão (Flexível e Responsivo)
export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
  padding-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

export const CardTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  transition: color 300ms;
  margin-bottom: 0.25rem;
  line-height: 1.2;
  color: ${({ $isPast }) => ($isPast ? '#9ca3af' : '#ffffff')};

  ${CardContainer}:hover & {
    color: ${({ $isPast }) => ($isPast ? '#ffffff' : '#c084fc')};
  }
`;

// 3. O Container de Tags Lateral
export const CardTagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 0.35rem;
  
  @media (min-width: 768px) {
    width: auto;
    flex-direction: column;
    align-items: flex-end;
    flex-wrap: nowrap;
    padding-left: 1rem;
    border-left: 2px dashed rgba(255, 255, 255, 0.2);
  }
`;

export const CardTag = styled.span`
  padding: 0.25rem 0.5rem;
  font-size: 9px;
  font-weight: 800;
  border-radius: 0.25rem;
  border: 1px solid;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  white-space: nowrap;
  
  /* Largura fixa apenas no desktop para alinhamento. No mobile abraça o conteúdo */
  @media (min-width: 768px) { width: 150px; }

  ${({ $color }) => {
    const colors = {
      amber: { bg: 'rgba(120, 53, 15, 0.3)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
      blue: { bg: 'rgba(30, 58, 138, 0.3)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
      emerald: { bg: 'rgba(6, 78, 59, 0.3)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
      purple: { bg: 'rgba(88, 28, 135, 0.3)', text: '#d8b4fe', border: 'rgba(168, 85, 247, 0.3)' },
    };
    const selected = colors[$color] || colors.purple;
    return css`
      background-color: ${selected.bg};
      color: ${selected.text};
      border-color: ${selected.border};
    `;
  }}
`;

// 4. Seções Internas e Box de Informações
export const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: ${({ $themeColor, $isPast }) => {
      if ($isPast) return '#6b7280';
      return $themeColor === 'blue' ? '#3b82f6' : '#a855f7'; 
    }};
    margin-bottom: 0.35rem;
  }
`;

export const InfoBox = styled.div`
  background-color: ${({ $bg }) => ($bg === 'dark' ? '#030712' : 'rgba(0, 0, 0, 0.4)')};
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #1f2937;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// 5. Linhas de Logística Universais (Usadas em Raids e Works)
export const LogisticRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'calc(50% - 0.25rem)')}; /* 50% em desktop se não for full */
  
  &:last-child { border-bottom: none; }

  @media (max-width: 767px) { width: 100%; }

  .icon-wrapper {
    color: ${({ $themeColor, $isPast }) => {
      if ($isPast) return '#6b7280';
      return $themeColor === 'blue' ? '#3b82f6' : '#a855f7';
    }};
    margin-top: 0.1rem;
  }
`;

export const LogisticData = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  
  .label {
    font-size: 10px;
    text-transform: uppercase;
    color: #9ca3af;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  
  .value {
    font-size: 0.85rem;
    color: #f3f4f6;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Variante para links clicáveis (ex: Arquivos e URLs) */
  .value.clickable {
    color: ${({ $themeColor }) => ($themeColor === 'blue' ? '#93c5fd' : '#c084fc')};
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.2);
    text-underline-offset: 2px;
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: #ffffff; }
  }

  .sub-value {
    font-size: 11px;
    color: #6b7280;
    margin-left: 0.5rem;
  }
`;

// 6. O Rodapé Universal
export const CardFooter = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite quebrar linha no mobile se houver muitos botões */
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${({ $themeColor }) => ($themeColor === 'blue' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)')};
  margin-top: 1rem;
  gap: 1rem;
`;

export const CardUser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: ${({ $themeColor }) =>
      $themeColor === 'blue' 
        ? 'linear-gradient(to bottom right, #2563eb, #0e7490)' 
        : 'linear-gradient(to bottom right, #9333ea, #4338ca)'
    };
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 900;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .details {
    display: flex;
    flex-direction: column;
    
    .name {
      font-size: 0.75rem;
      color: white;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .role {
      font-size: 10px;
      color: ${({ $themeColor }) => ($themeColor === 'blue' ? '#60a5fa' : '#c084fc')};
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;

export const Card = ({ children, isPast, variant, className }) => {
  return (
    <CardContainer $isPast={isPast} $variant={variant} className={className}>
      {children}
    </CardContainer>
  );
};