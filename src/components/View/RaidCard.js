import React from 'react';
import {
    Calendar,
    Clock,
    MonitorPlay,
    MapPin,
    Wifi,
    Layers,
    Edit,
    AlignLeft,
    Users
} from 'lucide-react';
import Card, { CardTitle, CardTag, CardSection, InfoBox } from '@/components/UI/Card';
import { PrimaryButton } from '@/components/UI/Form';
import styled from 'styled-components';

// Estilos específicos
const TagsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  gap: 0.35rem;
  padding-left: 1rem;
  border-left: 2px dashed rgba(255, 255, 255, 0.2);
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(168, 85, 247, 0.1);
  margin-top: 1rem;
`;

const LogisticItem = styled.div`
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

const LogisticContent = styled.div`
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

const ParticipantBadge = styled.div`
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

export default function RaidCard({ raid, currentUserId, onEdit, onEnter }) {
    const now = new Date();
    const isCreator = currentUserId === raid.creator;
    const isMember = raid.User_Meeting?.some(m => m.id_user === currentUserId) || isCreator;
    const isPast = new Date(raid.meeting_date) < now;

    // --- LÓGICA DE PARTICIPANTES ATUALIZADA ---
const maxPlayers = raid.user_limit || 0;
const currentPlayers = raid.current_participants || 0;

    // Bloqueia se: View marcou como full OU limite atingido OU limite é zero (0/0)
    const isFull = raid.is_full || (currentPlayers >= maxPlayers && maxPlayers > 0) || (maxPlayers === 0);

    const fillPercentage = maxPlayers > 0 ? Math.min((currentPlayers / maxPlayers) * 100, 100) : 0;

    // Mapeamento de dados das FKs
    const templateName = raid.meeting_tamplate?.option || 'Indefinido';
    const isRemoteLike = /remoto|online|vr/i.test(templateName);
    const platformName = raid.plataform_meeting?.option || 'Plataforma';
    const categoryName = raid.group_category?.option || 'Geral';
    const cardTitle = raid.theme?.option || 'Sem Tema';

    return (
        <Card isPast={isPast} variant={isCreator ? 'highlight' : 'default'}>

            {/* HEADER DA RAID */}
            <div className="flex justify-between items-start mb-6 gap-2 border-b-2 border-dashed border-white/20 pb-4">
                <div className='flex flex-col flex-1'>
                    <div className='flex flex-col items-start'>
                        <CardSection $isPast={isPast}><label>Tema da Raid</label></CardSection>
                        <CardTitle $isPast={isPast}>{cardTitle}</CardTitle>
                    </div>

                    <CardSection $isPast={isPast} className="mt-2">
                        <label><AlignLeft size={12} /> Descrição</label>
                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                            {raid.content || "Nenhuma descrição fornecida."}
                        </p>
                    </CardSection>
                </div>

                <TagsWrapper>
                    <CardTag $color="amber">
                        <Layers size={10} /> <span>{categoryName}</span>
                    </CardTag>
                    <CardTag $color={isRemoteLike ? 'blue' : 'emerald'}>
                        {isRemoteLike ? <Wifi size={10} /> : <MapPin size={10} />}
                        <span>{templateName}</span>
                    </CardTag>
                    <CardTag $color="purple">
                        <MonitorPlay size={10} /> <span>{platformName}</span>
                    </CardTag>
                </TagsWrapper>
            </div>

            {/* SEÇÃO DE LOGÍSTICA */}
            <CardSection $isPast={isPast}>
                <label><MonitorPlay size={12} /> Detalhes do Encontro</label>
                <InfoBox $bg="dark" className='flex flex-wrap'>

                    {/* ENDEREÇO / LINK */}
                    <LogisticItem $isPast={isPast} className='w-full'>
                        <div className="icon-wrapper">
                            {isRemoteLike ? <Wifi size={16} /> : <MapPin size={16} />}
                        </div>
                        <LogisticContent>
                            <span className="label">{isRemoteLike ? 'Link de Acesso' : 'Localização'}</span>
                            <span className="value truncate max-w-75">{raid.adress || 'Não informado'}</span>
                        </LogisticContent>
                    </LogisticItem>

                    {/* DATA */}
                    <LogisticItem $isPast={isPast} className='w-full md:w-1/2'>
                        <div className="icon-wrapper">
                            <Calendar size={16} />
                        </div>
                        <LogisticContent>
                            <span className="label">Data</span>
                            <span className="value">
                                {new Date(raid.meeting_date).toLocaleDateString('pt-BR', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'long'
                                })}
                            </span>
                        </LogisticContent>
                    </LogisticItem>

                    {/* HORÁRIO */}
                    <LogisticItem $isPast={isPast} className='w-full md:w-1/2'>
                        <div className="icon-wrapper">
                            <Clock size={16} />
                        </div>
                        <LogisticContent>
                            <span className="label">Início e Duração</span>
                            <div className="flex items-baseline">
                                <span className="value">
                                    {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="sub-value">
                                    • {raid.duration || '--'} min
                                </span>
                            </div>
                        </LogisticContent>
                    </LogisticItem>
                </InfoBox>
            </CardSection>

            {/* FOOTER */}
            <Footer>
                {/* Organizador */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/20">
                        {raid.User?.user_name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col text-[10px] uppercase">
                        <span className="text-white font-black tracking-wider">{raid.User?.user_name || 'Usuário'}</span>
                        <span className="text-purple-400 font-bold">Organizador</span>
                    </div>
                </div>

                {/* Contador de Participantes */}
                <ParticipantBadge $isFull={isFull} $percentage={fillPercentage}>
                    <span className="count-text">
                        <Users size={12} />
                        {currentPlayers}/{maxPlayers}
                    </span>
                    <div className="progress-bar">
                        <div className="fill" />
                    </div>
                </ParticipantBadge>

                {/* Ações */}
                <div className="flex gap-2">
                    {/* Botão de Editar (Apenas criador e se não passou) */}
                    {isCreator && !isPast && (
                        <button onClick={() => onEdit(raid)} className="...">
                            <Edit size={16} />
                        </button>
                    )}

                    {/* Lógica do Botão Principal */}
                    {isPast ? (
                        <span className="px-3 py-2 bg-gray-800/50 ...">Encerrada</span>
                    ) : isMember ? (
                        // Se já é membro ou criador, apenas ACESSA
                        <PrimaryButton
                            style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#4f46e5' }}
                            onClick={onEnter}
                        >
                            Acessar
                        </PrimaryButton>
                    ) : isFull ? (
                        <span className="px-3 py-2 bg-amber-500/10 ...">Raid Cheia</span>
                    ) : (
                        // Só mostra participar se não for membro E não estiver cheia
                        <PrimaryButton
                            style={{ padding: '0.5rem 1rem', fontSize: '10px' }}
                            onClick={onEnter}
                        >
                            Participar
                        </PrimaryButton>
                    )}
                </div>
            </Footer>
        </Card>
    );
}