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
} from './FiltersComponents';

export default function RaidFilters({
    timeFilter, setTimeFilter,
    categoryFilter, setCategoryFilter,
    templateFilter, setTemplateFilter,
    categories, templates, loading
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Container>
            <HeaderGroup>
                <Title>
                    Missões {timeFilter === 'past' ? 'Concluídas' : 'Ativas'}
                </Title>
                <Subtitle>Sincronizado com o servidor</Subtitle>
            </HeaderGroup>

            {!loading && (
                <FiltersWrapper>
                    <ExpandableArea $isExpanded={isExpanded}>
                        <FilterGrid>
                            
                            {/* Filtro 1: Status */}
                            <FilterCard>
                                <FilterLabel>Status</FilterLabel>
                                <ButtonGroup>
                                    <FilterButton 
                                        $active={timeFilter === 'all'} 
                                        onClick={() => setTimeFilter('all')}
                                    >
                                        Histórico Geral
                                    </FilterButton>
                                    <FilterButton 
                                        $active={timeFilter === 'past'} 
                                        onClick={() => setTimeFilter('past')}
                                    >
                                        Já Foram
                                    </FilterButton>
                                    <FilterButton 
                                        $active={timeFilter === 'upcoming'} 
                                        onClick={() => setTimeFilter('upcoming')}
                                    >
                                        A Acontecer
                                    </FilterButton>
                                </ButtonGroup>
                            </FilterCard>

                            {/* Filtro 2: Categoria Dinâmica */}
                            <FilterCard>
                                <FilterLabel>Tipo de Trabalho</FilterLabel>
                                {categories.length > 0 && (
                                    <ButtonGroup>
                                        <FilterButton 
                                            $active={categoryFilter === 'all'} 
                                            $colorType="cyan"
                                            onClick={() => setCategoryFilter('all')}
                                        >
                                            Tudo
                                        </FilterButton>
                                        {categories.map(cat => (
                                            <FilterButton 
                                                key={cat} 
                                                $active={categoryFilter === cat} 
                                                $colorType="cyan"
                                                onClick={() => setCategoryFilter(cat)}
                                            >
                                                {cat}
                                            </FilterButton>
                                        ))}
                                    </ButtonGroup>
                                )}
                            </FilterCard>

                            {/* Filtro 3: Modelos de Reunião Dinâmicos */}
                            {templates.length > 0 && (
                                <FilterCard>
                                    <FilterLabel>Modelos</FilterLabel>
                                    <ButtonGroup>
                                        <FilterButton 
                                            $active={templateFilter === 'all'} 
                                            $colorType="cyan"
                                            onClick={() => setTemplateFilter('all')}
                                        >
                                            Ambos
                                        </FilterButton>
                                        {templates.map(tpl => (
                                            <FilterButton 
                                                key={tpl} 
                                                $active={templateFilter === tpl} 
                                                $colorType="cyan"
                                                onClick={() => setTemplateFilter(tpl)}
                                            >
                                                {tpl}
                                            </FilterButton>
                                        ))}
                                    </ButtonGroup>
                                </FilterCard>
                            )}

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