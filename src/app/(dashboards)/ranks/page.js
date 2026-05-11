import { createClient } from '@/utils/supabase/server'; // 🔴 IMPORTANTE: Server
import { redirect } from 'next/navigation';
import RanksClientView from '@/features/ranking/RanksClientView';

export default async function RankingPage() {
    const supabase = await createClient();

    // 1. Verifica utilizador logado no servidor
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
        redirect('/'); // Proteção de rota no servidor
    }

    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
    const currentUserId = userData?.id;

    // 2. Busca TODOS os utilizadores e as suas relações DIRETAMENTE NO SERVIDOR
    const { data: usersData, error } = await supabase
        .from('User') 
        .select(`
            id, 
            user_name, 
            last_name,
            Work ( id, created_at ),
            Meeting ( id, created_at )
        `); 

    if (error) {
        console.error("Erro ao carregar dados do ranking:", error);
    }

    // 3. Renderiza a View do Cliente passando os dados prontos
    return (
        <RanksClientView 
            allUsersData={usersData || []} 
            currentUserId={currentUserId} 
        />
    );
}