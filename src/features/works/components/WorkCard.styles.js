import styled from 'styled-components';

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export const TagsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const ArchiveButton = styled.button`
  color: #93c5fd;
  text-decoration: underline;
  text-decoration-color: rgba(59, 130, 246, 0.3);
  text-underline-offset: 2px;
  transition: color 0.2s ease-in-out;
  font-weight: 500;
  text-align: left;
  
  &:hover {
    color: #ffffff;
  }
`;