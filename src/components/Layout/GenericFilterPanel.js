import React, { useState } from 'react';
import {
    Container, HeaderGroup, Title, Subtitle, FiltersWrapper,
    ExpandableArea, FilterGrid, FilterCard, FilterLabel,
    ButtonGroup, FilterButton, GradientOverlay, ToggleButton
} from '@/components/UI/FiltersComponents'; // Ajuste o import se estiver no mesmo arquivo

// 1. O Wrapper que controla a lógica de expandir/encolher
export function FilterPanel({ title, subtitle, children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Container>
            <HeaderGroup>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </HeaderGroup>

            <FiltersWrapper>
                <ExpandableArea $isExpanded={isExpanded}>
                    <FilterGrid>
                        {children}
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

// 2. O grupo individual de botões (Cards)
export function FilterOptionGroup({ label, options, activeValue, onChange, colorType = 'cyan' }) {
    if (!options || options.length === 0) return null;

    return (
        <FilterCard>
            <FilterLabel>{label}</FilterLabel>
            <ButtonGroup>
                {options.map((opt) => (
                    <FilterButton
                        key={opt.value}
                        $active={activeValue === opt.value}
                        $colorType={colorType}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </FilterButton>
                ))}
            </ButtonGroup>
        </FilterCard>
    );
}