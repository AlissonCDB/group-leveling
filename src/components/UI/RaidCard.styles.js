import styled from 'styled-components';

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  gap: 0.35rem;
  padding-left: 1rem;
  border-left: 2px dashed rgba(255, 255, 255, 0.2);

  @media (min-width: 768px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(168, 85, 247, 0.1);
  margin-top: 1rem;
`;

export const LogisticItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .icon-wrapper {
    color: ${props => props.$isPast ? '#6b7280' : '#a855f7'};
    margin-top: 0.1rem;
  }
`;

export const LogisticContent = styled.div`
  display: flex;
  flex-direction: column;
  
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
  }

  .sub-value {
    font-size: 11px;
    color: #6b7280;
    margin-left: 0.5rem;
  }
`;

export const ParticipantBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .count-text {
    font-size: 11px;
    font-weight: 800;
    color: ${props => props.$isFull ? '#f59e0b' : '#9ca3af'};
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .progress-bar {
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    
    .fill {
      height: 100%;
      width: ${props => props.$percentage}%;
      background: ${props => props.$isFull ? '#f59e0b' : '#a855f7'};
      transition: width 0.3s ease;
    }
  }
`;