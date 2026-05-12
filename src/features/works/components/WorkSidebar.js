import BaseSidebar from '@/components/Layout/BaseSidebar';
import { Briefcase, FilePlus } from 'lucide-react';
import { PrimaryButton } from '@/components/UI/Form';

export default function WorkSidebar({ onOpenCreateModal, scrollTop }) {
    return (
        <BaseSidebar
            scrollTop={scrollTop}
            themeColor="#1d4ed8" /* blue-700 */
            icon={Briefcase}
            title="Central de Trabalhos"
            description="Encontre missões académicas, consulte materiais de estudo e entregue os seus projetos."
            actionButton={
                <PrimaryButton onClick={onOpenCreateModal}>
                    <FilePlus size={20} className="mr-2 inline" /> NOVO TRABALHO
                </PrimaryButton>
            }
        />
    );
}