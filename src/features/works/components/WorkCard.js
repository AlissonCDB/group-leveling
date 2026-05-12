import React from 'react';
import { FileText, GraduationCap, Link as LinkIcon, Edit, BookOpen, Download } from 'lucide-react';
import { 
    Card, CardHeader, CardTitle, CardTagsWrapper, CardTag, 
    CardSection, InfoBox, LogisticRow, LogisticData, 
    CardFooter, CardUser 
} from '@/components/UI/Card';
import { PrimaryButton } from '@/components/UI/Form';

export default function WorkCard({ work, currentUserId, onEdit, onDownload }) {
    const isCreator = currentUserId === work.user_id;

    return (
        <Card variant={isCreator ? 'highlight' : 'default'}>
            
            <CardHeader>
                <div className='flex flex-col items-start w-full md:w-auto'>
                    <label className="text-[10px] uppercase font-bold text-blue-500 tracking-widest mb-1">Título do Arquivo</label>
                    <CardTitle>{work.subject}</CardTitle>
                </div>

                <CardTagsWrapper>
                    <CardTag $color="blue">
                        <FileText size={10} /> <span>{work.type}</span>
                    </CardTag>
                    <CardTag $color="emerald">
                        <GraduationCap size={10} /> <span>{work.graduation}</span>
                    </CardTag>
                </CardTagsWrapper>
            </CardHeader>

            <CardSection $themeColor="blue">
                <label><BookOpen size={12} /> Detalhes do Arquivo</label>
                <InfoBox $bg="dark">
                    <LogisticRow $fullWidth $themeColor="blue">
                        <div className="icon-wrapper"><LinkIcon size={16} /></div>
                        <LogisticData $themeColor="blue">
                            <span className="label">Link de Acesso Seguro</span>
                            <span className="value clickable" onClick={onDownload} title={work.archive}>
                                {work.archive}
                            </span>
                        </LogisticData>
                    </LogisticRow>
                </InfoBox>
            </CardSection>

            <CardFooter $themeColor="blue">
                <CardUser $themeColor="blue">
                    <div className="avatar">
                        {work.User?.user_name?.[0].toUpperCase() || '?'}
                    </div>
                    <div className="details">
                        <span className="name">{work.User?.user_name || 'Desconhecido'} {work.User?.last_name || ''}</span>
                        <span className="role">Autor</span>
                    </div>
                </CardUser>
                
                <div className="flex gap-2 items-center">
                    {isCreator && (
                        <button onClick={() => onEdit && onEdit(work)} className="p-2 text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/30 rounded-lg transition-all border border-amber-500/30">
                            <Edit size={16} />
                        </button>
                    )}
                    <PrimaryButton onClick={onDownload} style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#2563eb' }}>
                        <span className="flex items-center gap-1.5"><Download size={12} /> Baixar</span>
                    </PrimaryButton>
                </div>
            </CardFooter>
            
        </Card>
    );
}