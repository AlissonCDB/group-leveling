import React from 'react';
import {
    Calendar, Clock, MonitorPlay, MapPin, Wifi, Layers, Edit, AlignLeft, Users
} from 'lucide-react';
import { Card, CardTitle, CardTag, CardSection, InfoBox } from '@/components/UI/Card';
import { PrimaryButton } from '@/components/UI/Form';

// 🔴 IMPORT CORRIGIDO: Como moram na mesma pasta, usamos apenas "./"
import {
    TagsWrapper, Footer, LogisticItem, LogisticContent, ParticipantBadge
} from './RaidCard.styles';

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
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-2 border-b-2 border-dashed border-white/20 pb-4">
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
                    <CardTag $color="amber"><Layers size={10} /> <span>{categoryName}</span></CardTag>
                    <CardTag $color={isRemoteLike ? 'blue' : 'emerald'}>
                        {isRemoteLike ? <Wifi size={10} /> : <MapPin size={10} />}
                        <span>{templateName}</span>
                    </CardTag>
                    <CardTag $color="purple"><MonitorPlay size={10} /> <span>{platformName}</span></CardTag>
                </TagsWrapper>
            </div>

            <CardSection $isPast={isPast}>
                <label><MonitorPlay size={12} /> Detalhes do Encontro</label>
                <InfoBox $bg="dark" className='flex flex-wrap'>
                    <LogisticItem $isPast={isPast} className='w-full'>
                        <div className="icon-wrapper">{isRemoteLike ? <Wifi size={16} /> : <MapPin size={16} />}</div>
                        <LogisticContent>
                            <span className="label">{isRemoteLike ? 'Link de Acesso' : 'Localização'}</span>
                            <span className="value truncate max-w-75">{raid.adress || 'Não informado'}</span>
                        </LogisticContent>
                    </LogisticItem>

                    <LogisticItem $isPast={isPast} className='w-full md:w-1/2'>
                        <div className="icon-wrapper"><Calendar size={16} /></div>
                        <LogisticContent>
                            <span className="label">Data</span>
                            <span className="value">
                                {new Date(raid.meeting_date).toLocaleDateString('pt-BR', {
                                    weekday: 'short', day: '2-digit', month: 'long', timeZone: 'UTC'
                                })}
                            </span>
                        </LogisticContent>
                    </LogisticItem>

                    <LogisticItem $isPast={isPast} className='w-full md:w-1/2'>
                        <div className="icon-wrapper"><Clock size={16} /></div>
                        <LogisticContent>
                            <span className="label">Início e Duração</span>
                            <div className="flex items-baseline">
                                <span className="value">
                                    {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', {
                                        timeZone: 'UTC', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                                <span className="sub-value">• {raid.duration || '--'}</span>
                            </div>
                        </LogisticContent>
                    </LogisticItem>
                </InfoBox>
            </CardSection>

            <Footer>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/20">
                        {raid.User?.user_name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col text-[10px] uppercase">
                        <span className="text-white font-black tracking-wider">{raid.User?.user_name || 'Usuário'}</span>
                        <span className="text-purple-400 font-bold">Organizador</span>
                    </div>
                </div>

                <ParticipantBadge $isFull={isFull} $percentage={fillPercentage}>
                    <span className="count-text"><Users size={12} />{currentPlayers}/{maxPlayers}</span>
                    <div className="progress-bar"><div className="fill" /></div>
                </ParticipantBadge>

                <div className="flex gap-2">
                    {isCreator && !isPast && (
                        <button onClick={() => onEdit(raid)} className="...">
                            <Edit size={16} />
                        </button>
                    )}
                    {isPast ? (
                        <span className="px-3 py-2 bg-gray-800/50 ...">Encerrada</span>
                    ) : isMember ? (
                        <PrimaryButton style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#4f46e5' }} onClick={onEnter}>
                            Acessar
                        </PrimaryButton>
                    ) : isFull ? (
                        <span className="px-3 py-2 bg-amber-500/10 ...">Raid Cheia</span>
                    ) : (
                        <PrimaryButton style={{ padding: '0.5rem 1rem', fontSize: '10px' }} onClick={onEnter}>
                            Participar
                        </PrimaryButton>
                    )}
                </div>
            </Footer>
        </Card>
    );
}