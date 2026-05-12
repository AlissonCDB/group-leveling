import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import RaidRoomClientView from '@/features/raids/RaidRoomClientView';

export default async function RaidRoomPage({ params }) {
    // No Next.js 15, os params precisam do await
    const resolvedParams = await params;
    const raidId = resolvedParams.id;

    const supabase = await createClient();

    // 1. Identificar Utilizador
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/');

    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
    if (!userData) redirect('/home');

    // 2. Buscar Dados da Raid
    const { data: raidData } = await supabase
        .from('Meeting')
        .select(`
            *,
            User:creator ( user_name, last_name, Class ( name_class ) ),
            plataform_meeting ( option ),
            theme ( option ),
            meeting_tamplate ( option ),
            group_category ( option )
        `)
        .eq('id', raidId)
        .single();

    if (!raidData) {
        return <div className="flex w-screen h-screen items-center justify-center bg-gray-950 text-white">Raid não encontrada ou cancelada.</div>;
    }

    // 3. Buscar Comentários Iniciais
    const { data: commentsData } = await supabase
        .from('Comments')
        .select(`
            id, created_at, text, user_id, 
            User:user_id ( user_name, last_name, Class ( name_class ) )
        `)
        .eq('meeting_id', raidId)
        .order('created_at', { ascending: true });

    // 4. Entrega tudo pronto para a View (Sem loadings!)
    return (
        <RaidRoomClientView 
            raid={raidData} 
            initialComments={commentsData || []} 
            currentUserId={userData.id} 
            raidId={raidId} 
        />
    );
}