import styled from 'styled-components';
import Image from 'next/image';

const SidebarWrapper = styled.div`
  position: sticky;
  top: calc(-40vh + 70px); /* Garante que sobra espaço para o botão no topo */
  width: 100%;
  height: 40vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: all 0.3s;
  z-index: 50;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  background-color: ${({ $themeColor }) => $themeColor || '#1f2937'};

  @media (min-width: 768px) {
    position: relative;
    top: 0;
    width: 33.333333%;
    height: 100vh;
  }
`;

const DynamicContent = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  /* O padding inferior diminui conforme o scroll sobe */
  padding-bottom: calc(1rem + (1rem * (1 - var(--scroll-progress))));

  @media (min-width: 768px) {
    position: relative;
    justify-content: center;
    padding: 2rem;
  }
`;

const DynamicText = styled.div`
  opacity: calc(1 - var(--scroll-progress));
  transform: translateY(calc(-20px * var(--scroll-progress)));
  max-height: calc(400px * (1 - var(--scroll-progress)));
  margin-bottom: calc(2rem * (1 - var(--scroll-progress)));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;

  @media (min-width: 768px) {
    opacity: 1;
    transform: none;
    max-height: none;
    margin-bottom: 2rem;
  }
`;

const DynamicButtonContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 10px; /* 🔴 OS 10PX DA BORDA QUE VOCÊ PEDIU */

  .spacer-left {
    flex-grow: 1; /* Empurra o botão para a direita */
  }
  .spacer-right {
    flex-grow: calc(1 - var(--scroll-progress)); /* Diminui para colar na direita */
  }

  @media (min-width: 768px) {
    justify-content: center;
    padding: 0;
    .spacer-left, .spacer-right { display: none; }
  }
`;

const IconContainer = styled.div`
  display: none;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

export default function BaseSidebar({ title, description, icon: Icon, themeColor, actionButton, scrollTop = 0 }) {
    // Cálculo do progresso (0 a 1) baseado no scroll
    const maxScroll = 150;
    const progress = Math.min(scrollTop / maxScroll, 1);

    return (
        <SidebarWrapper $themeColor={themeColor} style={{ '--scroll-progress': progress }}>
            <Image
                src="/assets/background.png"
                alt="Background"
                fill
                priority
                className="object-cover opacity-10 mix-blend-overlay pointer-events-none z-0"
            />
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
            
            <DynamicContent className="z-10">
                <DynamicText>
                    {Icon && (
                        <IconContainer>
                            <Icon size={40} className="text-white/80" />
                        </IconContainer>
                    )}
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                        {title}
                    </h1>
                    <p className="text-sm md:text-base text-white/80 max-w-xs font-medium px-4">
                        {description}
                    </p>
                </DynamicText>

                {actionButton && (
                    <DynamicButtonContainer>
                        <div className="spacer-left" />
                        <div className="shrink-0">
                            {actionButton}
                        </div>
                        <div className="spacer-right" />
                    </DynamicButtonContainer>
                )}
            </DynamicContent>
        </SidebarWrapper>
    );
}