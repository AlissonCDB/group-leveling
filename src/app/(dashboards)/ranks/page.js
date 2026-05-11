import { createClient } from '@/utils/supabase/server'; 
import { redirect } from 'next/navigation';
import RanksClientView from '@/features/ranking/RanksClientView';

export default async function RankingPage() {
    const supabase = await createClient();

    // 1. Verifica utilizador logado no servidor
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
        redirect('/'); 
    }

    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
    const currentUserId = userData?.id;

    // 2. Busca TODOS os utilizadores e as avaliações DIRETAMENTE NO SERVIDOR
    const { data: usersData, error } = await supabase
        .from('User') 
        .select(`
            id, 
            user_name, 
            last_name,
            Work ( id, created_at, User_Work ( rating ) ),
            Meeting ( id, created_at, User_Meeting ( rating ) )
        `); 

    if (error) {
        console.error("Erro ao carregar dados do ranking:", error);
    }

    // 3. Renderiza a View passando os DADOS BRUTOS (O RanksClientView agora faz o cálculo e os filtros!)
    return (
        <RanksClientView 
            allUsersData={usersData || []} 
            currentUserId={currentUserId} 
        />
    );
}