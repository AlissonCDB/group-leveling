import { createClient } from '@/utils/supabase/server';
import { userService } from '@/services/user.service';
import { meetingService } from '@/services/meeting.service';
import { filterService } from '@/services/filter.service'; 
import RaidsClientView from '@/features/raids/RaidsClientView';

export default async function GroupsPage() {
    const supabase = await createClient();

    try {
        const [currentUserId, raidsData, groupedFilters] = await Promise.all([
            userService.getCurrentUserId(supabase),
            meetingService.getAllRaids(supabase),
            filterService.getFiltersGrouped(supabase)
        ]);

        return (
            <RaidsClientView 
                initialRaids={raidsData || []} 
                categories={groupedFilters.categories || []}
                templates={groupedFilters.templates || []}
                platforms={groupedFilters.platforms || []}
                themes={groupedFilters.themes || []}
                currentUserId={currentUserId}
            />
        );

    } catch (err) {
        console.error("Erro ao carregar dados da página de Raids:", err);
        
        // Retorno de fallback seguro para evitar que a aplicação quebre em caso de erro no banco
        return (
            <RaidsClientView 
                initialRaids={[]} 
                categories={[]}
                templates={[]}
                platforms={[]}
                themes={[]}
                currentUserId={null}
            />
        );
    }
}