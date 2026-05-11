import React from 'react';
import { FileText, GraduationCap, Link as LinkIcon, User, Edit } from 'lucide-react';
import { Card, CardTitle, CardTag, CardSection, InfoBox, CardFooter, CardUser } from '@/components/UI/Card';
import { PrimaryButton } from '@/components/UI/Form';

// 🔴 IMPORT CORRIGIDO: Como moram na mesma pasta, usamos apenas "./"
import { HeaderRow, TagsColumn, ArchiveButton } from './WorkCard.styles';

export default function WorkCard({ work, currentUserId, onEdit, onDownload }) {
    const isCreator = currentUserId === work.user_id;

    return (
        <Card variant={isCreator ? 'highlight' : 'default'}>
            <div>
                <HeaderRow>
                    <CardTitle>{work.subject}</CardTitle>
                    
                    <TagsColumn>
                        <CardTag $color="blue">
                            <FileText size={10} /> <span>{work.type}</span>
                        </CardTag>
                        <CardTag $color="emerald">
                            <GraduationCap size={10} /> <span>{work.graduation}</span>
                        </CardTag>
                    </TagsColumn>
                </HeaderRow>

                <CardSection>
                    <label><LinkIcon size={12} /> Link do Arquivo</label>
                    <InfoBox $bg="dark">
                        <ArchiveButton onClick={onDownload}>
                            {work.archive}
                        </ArchiveButton>
                    </InfoBox>
                </CardSection>
            </div>

            <CardFooter>
                <CardUser $color="blue">
                    <div className="avatar">
                        {work.User?.user_name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="details">
                        <span className="name">
                            {work.User?.user_name || 'Desconhecido'} {work.User?.last_name || ''}
                        </span>
                        <span className="role">
                            <User size={10} /> Autor
                        </span>
                    </div>
                </CardUser>
                
                <div className="flex gap-2 items-center">
                    {isCreator && (
                        <button 
                            onClick={() => onEdit && onEdit(work)} 
                            className="p-1.5 text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/30 rounded-lg transition-all border border-amber-500/30" 
                            title="Editar Trabalho"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    
                    <PrimaryButton 
                        onClick={onDownload}
                        style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#2563eb' }}
                    >
                        Acessar
                    </PrimaryButton>
                </div>
            </CardFooter>
        </Card>
    );
}