import { createClient } from '@/utils/supabase/server'; // 🔴 IMPORTANTE: Usar o Server Client
import { workService } from '@/services/work.service';
import WorksClientView from '@/features/works/WorksClientView';

export default async function WorksPage() {
    const supabase = await createClient();
    
    let currentUserId = null;

    try {
        // 1. Identifica o usuário logado
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
            const { data: userData } = await supabase
                .from('User')
                .select('id')
                .eq('id_login', authUser.id)
                .single();
                
            if (userData) currentUserId = userData.id;
        }

        // 2. Busca os trabalhos direto no servidor (sem loading state na tela!)
        const worksData = await workService.getAllWorks(supabase);

        // 3. Renderiza a View do Cliente passando os dados já prontos
        return (
            <WorksClientView 
                initialWorks={worksData || []} 
                currentUserId={currentUserId} 
            />
        );

    } catch (error) {
        console.error("Erro ao carregar a página de trabalhos:", error);
        // Em caso de erro, você pode passar um array vazio ou tratar na UI
        return <WorksClientView initialWorks={[]} currentUserId={currentUserId} />;
    }
}