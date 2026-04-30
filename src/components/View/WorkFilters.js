import React, { useState } from 'react';
import {
Container,
  HeaderGroup,
  Title,
  Subtitle,
  FiltersWrapper,
  ExpandableArea,
  FilterGrid,
  FilterCard,
  FilterLabel,
  ButtonGroup,
  FilterButton,
  GradientOverlay,
  ToggleButton
} from './FiltersComponents.js';

export default function WorkFilters({
    typeFilter, setTypeFilter,
    graduationFilter, setGraduationFilter,
    uniqueTypes, uniqueGraduations, loading
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Container>
            <HeaderGroup>
                <Title>Arquivo Geral</Title>
                <Subtitle>Acervo Académico</Subtitle>
            </HeaderGroup>

            {!loading && (
                <FiltersWrapper>
                    <ExpandableArea $isExpanded={isExpanded}>
                        <FilterGrid>
                            
                            {/* Filtro de Tipo de Trabalho (Disciplina) */}
                            <FilterCard>
                                <FilterLabel>Disciplina</FilterLabel>
                                {uniqueTypes.length > 0 && (
                                    <ButtonGroup>
                                        <FilterButton 
                                            $active={typeFilter === 'all'} 
                                            onClick={() => setTypeFilter('all')}
                                        >
                                            Tudo
                                        </FilterButton>
                                        {uniqueTypes.map(type => (
                                            <FilterButton 
                                                key={type} 
                                                $active={typeFilter === type} 
                                                onClick={() => setTypeFilter(type)}
                                            >
                                                {type}
                                            </FilterButton>
                                        ))}
                                    </ButtonGroup>
                                )}
                            </FilterCard>

                            {/* Filtro de Graduação / Nível */}
                            <FilterCard>
                                <FilterLabel>Tipo de Trabalho</FilterLabel>
                                {uniqueGraduations.length > 0 && (
                                    <ButtonGroup>
                                        <FilterButton 
                                            $active={graduationFilter === 'all'} 
                                            $colorType="cyan"
                                            onClick={() => setGraduationFilter('all')}
                                        >
                                            Todos
                                        </FilterButton>
                                        {uniqueGraduations.map(grad => (
                                            <FilterButton 
                                                key={grad} 
                                                $active={graduationFilter === grad} 
                                                $colorType="cyan"
                                                onClick={() => setGraduationFilter(grad)}
                                            >
                                                {grad}
                                            </FilterButton>
                                        ))}
                                    </ButtonGroup>
                                )}
                            </FilterCard>

                            {/* Filtro de Tags Adicionais */}
                            <FilterCard>
                                <FilterLabel>Tags Adicionais</FilterLabel>
                                {uniqueGraduations.length > 0 && (
                                    <ButtonGroup>
                                        <FilterButton 
                                            $active={graduationFilter === 'all'} 
                                            $colorType="cyan"
                                            onClick={() => setGraduationFilter('all')}
                                        >
                                            Todos
                                        </FilterButton>
                                        {uniqueGraduations.map(grad => (
                                            <FilterButton 
                                                key={grad} 
                                                $active={graduationFilter === grad} 
                                                $colorType="cyan"
                                                onClick={() => setGraduationFilter(grad)}
                                            >
                                                {grad}
                                            </FilterButton>
                                        ))}
                                    </ButtonGroup>
                                )}
                            </FilterCard>

                        </FilterGrid>

                        {!isExpanded && <GradientOverlay />}
                    </ExpandableArea>

                    <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? (
                            <>Ver menos filtros <span>−</span></>
                        ) : (
                            <>Ver mais filtros <span>+</span></>
                        )}
                    </ToggleButton>
                </FiltersWrapper>
            )}
        </Container>
    );
}