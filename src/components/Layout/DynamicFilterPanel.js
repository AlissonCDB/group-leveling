import React, { useState } from 'react';
import {
    Container, HeaderGroup, Title, Subtitle, FiltersWrapper,
    ExpandableArea, FilterGrid, FilterCard, FilterLabel,
    ButtonGroup, FilterButton, GradientOverlay, ToggleButton
} from '@/components/UI/FiltersComponents';

export default function DynamicFilterPanel({ title, subtitle, config, currentFilters, onFilterChange }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Função melhorada: Verifica se o 'all' já existe antes de o adicionar!
    const mapToOptions = (items) => {
        const mappedItems = (items || []).map(item => ({ 
            value: item.value || item, 
            label: item.label || item 
        }));

        // Verifica se já existe a opção "all"
        const hasAll = mappedItems.some(item => item.value === 'all');
        
        // Se não tiver, adiciona no início
        if (!hasAll) {
            return [{ value: 'all', label: 'Todos' }, ...mappedItems];
        }

        return mappedItems;
    };

    return (
        <Container>
            <HeaderGroup>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </HeaderGroup>

            <FiltersWrapper>
                <ExpandableArea $isExpanded={isExpanded}>
                    <FilterGrid>
                        {config.map((filterParam) => (
                            <FilterCard key={filterParam.key}>
                                <FilterLabel>{filterParam.label}</FilterLabel>
                                <ButtonGroup>
                                    {mapToOptions(filterParam.options).map((opt) => (
                                        <FilterButton
                                            key={opt.value}
                                            $active={currentFilters[filterParam.key] === opt.value}
                                            $colorType={filterParam.color}
                                            onClick={() => onFilterChange(filterParam.key, opt.value)}
                                        >
                                            {opt.label}
                                        </FilterButton>
                                    ))}
                                </ButtonGroup>
                            </FilterCard>
                        ))}
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
        </Container>
    );
}