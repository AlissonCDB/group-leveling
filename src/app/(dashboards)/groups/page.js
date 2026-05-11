import { createClient } from '@/utils/supabase/server'; // 🔴 ATENÇÃO: Import do Server
import { meetingService } from '@/services/meeting.service';
import RaidsClientView from '@/features/raids/RaidsClientView';

export default async function GroupsPage() {
    const supabase = await createClient();
    
    let currentUserId = null;
    let categories = [];
    let templates = [];
    let raidsData = [];

    try {
        // 1. Identifica o utilizador logado
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
            if (userData) currentUserId = userData.id;
        }

        // 2. Busca todas as Raids ativas/históricas
        raidsData = await meetingService.getAllRaids(supabase);

        // 3. Busca os Filtros
        const { data: filtersData } = await supabase.from('Filters').select('*');
        if (filtersData) {
            categories = filtersData.filter(f => f.category?.trim().toLowerCase() === 'group_category').map(f => f.option);
            templates = filtersData.filter(f => f.category?.trim().toLowerCase() === 'meeting_tamplate').map(f => f.option);
        }

    } catch (err) {
        console.error("Erro ao carregar dados da página de Raids:", err);
    }

    // 4. Renderiza a View do Cliente passando tudo já pronto (Sem Loadings!)
    return (
        <RaidsClientView 
            initialRaids={raidsData || []} 
            categories={categories}
            templates={templates}
            currentUserId={currentUserId}
        />
    );
}