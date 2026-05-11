import React from 'react';
import styled from 'styled-components';
import {
    Calendar, Clock, MonitorPlay, MapPin, Wifi, Layers, Edit, AlignLeft, Users
} from 'lucide-react';

import { 
    Card, CardHeader, CardTitle, CardTagsWrapper, CardTag, 
    CardSection, InfoBox, LogisticRow, LogisticData, 
    CardFooter, CardUser 
} from '@/components/UI/Card';
import { PrimaryButton } from '@/components/UI/Form';

// Trazemos o ParticipantBadge para dentro do componente, já que é o único estilo 
// 100% exclusivo das Raids (barra de progresso de vagas).
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

    const utcDate = new Date(raid.meeting_date);
    const raidDate = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes()
    );
    const isPast = raidDate < now;

    const maxPlayers = raid.user_limit || 0;
    const currentPlayers = raid.current_participants || 0;
    const isFull = raid.is_full || (currentPlayers >= maxPlayers && maxPlayers > 0) || (maxPlayers === 0);
    const fillPercentage = maxPlayers > 0 ? Math.min((currentPlayers / maxPlayers) * 100, 100) : 0;

    const templateName = raid.meeting_tamplate?.option || 'Indefinido';
    const isRemoteLike = /remoto|online|vr/i.test(templateName);
    const platformName = raid.plataform_meeting?.option || 'Plataforma';
    const categoryName = raid.group_category?.option || 'Geral';
    const cardTitle = raid.theme?.option || 'Sem Tema';

    return (
        <Card isPast={isPast} variant={isCreator ? 'highlight' : 'default'}>
            
            {/* CABEÇALHO */}
            <CardHeader>
                <div className='flex flex-col items-start w-full md:w-auto'>
                    <label className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isPast ? 'text-gray-500' : 'text-purple-500'}`}>
                        Tema da Raid
                    </label>
                    <CardTitle $isPast={isPast}>{cardTitle}</CardTitle>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mt-2 max-w-sm">
                        <AlignLeft size={12} className="inline mr-1" />
                        {raid.content || "Nenhuma descrição fornecida."}
                    </p>
                </div>

                <CardTagsWrapper>
                    <CardTag $color="amber"><Layers size={10} /> <span>{categoryName}</span></CardTag>
                    <CardTag $color={isRemoteLike ? 'blue' : 'emerald'}>
                        {isRemoteLike ? <Wifi size={10} /> : <MapPin size={10} />}
                        <span>{templateName}</span>
                    </CardTag>
                    <CardTag $color="purple"><MonitorPlay size={10} /> <span>{platformName}</span></CardTag>
                </CardTagsWrapper>
            </CardHeader>

            {/* DETALHES DA MISSÃO */}
            <CardSection $isPast={isPast} $themeColor="purple">
                <label><MonitorPlay size={12} /> Detalhes do Encontro</label>
                <InfoBox $bg="dark">
                    <LogisticRow $fullWidth $isPast={isPast} $themeColor="purple">
                        <div className="icon-wrapper">{isRemoteLike ? <Wifi size={16} /> : <MapPin size={16} />}</div>
                        <LogisticData>
                            <span className="label">{isRemoteLike ? 'Link de Acesso' : 'Localização'}</span>
                            <span className="value truncate">{raid.adress || 'Não informado'}</span>
                        </LogisticData>
                    </LogisticRow>

                    <LogisticRow $isPast={isPast} $themeColor="purple">
                        <div className="icon-wrapper"><Calendar size={16} /></div>
                        <LogisticData>
                            <span className="label">Data</span>
                            <span className="value">
                                {new Date(raid.meeting_date).toLocaleDateString('pt-BR', {
                                    weekday: 'short', day: '2-digit', month: 'long', timeZone: 'UTC'
                                })}
                            </span>
                        </LogisticData>
                    </LogisticRow>

                    <LogisticRow $isPast={isPast} $themeColor="purple">
                        <div className="icon-wrapper"><Clock size={16} /></div>
                        <LogisticData>
                            <span className="label">Início e Duração</span>
                            <div className="flex items-baseline">
                                <span className="value">
                                    {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', {
                                        timeZone: 'UTC', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                                <span className="sub-value">• {raid.duration || '--'}</span>
                            </div>
                        </LogisticData>
                    </LogisticRow>
                </InfoBox>
            </CardSection>

            {/* RODAPÉ */}
            <CardFooter $themeColor="purple">
                <CardUser $themeColor="purple">
                    <div className="avatar">
                        {raid.User?.user_name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="details">
                        <span className="name">{raid.User?.user_name || 'Usuário'}</span>
                        <span className="role">Organizador</span>
                    </div>
                </CardUser>

                <ParticipantBadge $isFull={isFull} $percentage={fillPercentage}>
                    <span className="count-text"><Users size={12} />{currentPlayers}/{maxPlayers}</span>
                    <div className="progress-bar"><div className="fill" /></div>
                </ParticipantBadge>

                <div className="flex gap-2 items-center">
                    {isCreator && !isPast && (
                        <button onClick={() => onEdit(raid)} className="p-1.5 text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/30 rounded-lg transition-all border border-amber-500/30">
                            <Edit size={16} />
                        </button>
                    )}
                    {isPast ? (
                        <span className="px-3 py-2 bg-gray-800/50 border border-gray-700 text-[10px] uppercase font-bold text-gray-500 rounded-lg">Encerrada</span>
                    ) : isMember ? (
                        <PrimaryButton style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#4f46e5' }} onClick={onEnter}>
                            Acessar
                        </PrimaryButton>
                    ) : isFull ? (
                        <span className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-[10px] uppercase font-bold text-amber-500 rounded-lg">Raid Cheia</span>
                    ) : (
                        <PrimaryButton style={{ padding: '0.5rem 1rem', fontSize: '10px' }} onClick={onEnter}>
                            Participar
                        </PrimaryButton>
                    )}
                </div>
            </CardFooter>
            
        </Card>
    );
}