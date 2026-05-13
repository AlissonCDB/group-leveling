import { createClient } from '@/utils/supabase/server';
import { meetingService } from '@/services/meeting.service';
import { filterService } from '@/services/filter.service'; 
import RaidsClientView from '@/features/raids/RaidsClientView';

export default async function GroupsPage() {
    const supabase = await createClient();
    
    let currentUserId = null;
    let raidsData = [];
    
    let groupedFilters = { categories: [], templates: [], themes: [], platforms: [] };

    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
            if (userData) currentUserId = userData.id;
        }

        raidsData = await meetingService.getAllRaids(supabase);
        groupedFilters = await filterService.getFiltersGrouped(supabase);

    } catch (err) {
        console.error("Erro ao carregar dados da página de Raids:", err);
    }

    // Passando arrays limpos extraindo apenas a prop "option" do BD
    return (
        <RaidsClientView 
            initialRaids={raidsData || []} 
            categories={(groupedFilters.categories || []).map(f => f.option)}
            templates={(groupedFilters.templates || []).map(f => f.option)}
            platforms={(groupedFilters.platforms || []).map(f => f.option)}
            currentUserId={currentUserId}
        />
    );
}