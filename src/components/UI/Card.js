import React from 'react';
import styled, { css } from 'styled-components';

// --- Estilos Base Reutilizáveis ---

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

export const CardTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.025em;
  transition: color 300ms;
  margin-bottom: 0.25rem;
  color: ${({ $isPast }) => ($isPast ? '#9ca3af' : '#ffffff')};

  ${CardContainer}:hover & {
    color: ${({ $isPast }) => ($isPast ? '#ffffff' : '#c084fc')};
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
  width: 120px;

  @media (min-width: 768px) {
    width: 150px;
  }

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

export const CardSection = styled.div`

  label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: ${({ $isPast }) => ($isPast ? '#6b7280' : '#a855f7')};
    margin-bottom: 0.35rem;
  }
`;

export const InfoBox = styled.div`
  background-color: ${({ $bg }) => ($bg === 'dark' ? '#030712' : 'rgba(0, 0, 0, 0.4)')};
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #1f2937;
  font-size: 0.75rem;
  color: #e5e7eb;
`;

// Componente Wrapper Genérico
const Card = ({ children, isPast, variant, className }) => {
  return (
    <CardContainer $isPast={isPast} $variant={variant} className={className}>
      {children}
    </CardContainer>
  );
};

export default Card;