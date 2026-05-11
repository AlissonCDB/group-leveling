import styled from 'styled-components';
import Image from 'next/image';

const SidebarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  transition: all 0.3s;
  z-index: 10;
  overflow: hidden;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);

  /* A mágica da reutilização: aceitamos a cor como propriedade! */
  background-color: ${({ $themeColor }) => $themeColor || '#1f2937'};

  @media (min-width: 768px) {
    width: 33.333333%;
    height: 100vh;
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

export default function BaseSidebar({ title, description, icon: Icon, themeColor, actionButton }) {
    return (
        <SidebarWrapper $themeColor={themeColor}>
            
            {/* 1. Imagem de Fundo (Textura) com next/image */}
            <Image
                src="/assets/background.png"
                alt="Background Texture"
                fill
                priority
                className="object-cover opacity-10 mix-blend-overlay pointer-events-none z-0"
            />

            {/* 2. Overlay Escuro (para garantir o contraste do texto por cima da imagem) */}
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
                {Icon && (
                    <IconContainer>
                        <Icon size={40} className="text-white/80" />
                    </IconContainer>
                )}
                
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                    {title}
                </h1>
                
                <p className="text-sm md:text-base text-white/80 max-w-xs font-medium leading-relaxed mb-8">
                    {description}
                </p>

                {actionButton && <div>{actionButton}</div>}
            </div>
        </SidebarWrapper>
    );
}