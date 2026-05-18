import { createClient } from '@/utils/supabase/server';
import { workService } from '@/services/work.service';
import { userService } from '@/services/user.service';
import { filterService } from '@/services/filter.service';
import WorksClientView from '@/features/works/WorksClientView';

export default async function WorksPage() {
    const supabase = await createClient();

    try {
        // Busca de dados em paralelo (Trabalhos + Filtros + Usuário)
        const [currentUserId, worksData, groupedFilters] = await Promise.all([
            userService.getCurrentUserId(supabase),
            workService.getAllWorks(supabase),
            filterService.getFiltersGrouped(supabase)
        ]);

        return (
            <WorksClientView
                initialWorks={worksData || []}
                currentUserId={currentUserId}
                workTypes={groupedFilters.workTypes || []}
                semester={groupedFilters.semester || []}
            />
        );
    } catch (error) {
        console.error("Erro ao carregar a página de trabalhos:", error.message || JSON.stringify(error));
        return <WorksClientView initialWorks={[]} currentUserId={null} workTypes={[]} semester={[]} />;
    }
}