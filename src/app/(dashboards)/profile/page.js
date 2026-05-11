import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClientView from '@/features/profile/ProfileClientView';

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Validar Sessão
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/');

    // 2. Buscar Dados Principais do Utilizador
    const { data: profileData } = await supabase
        .from('User')
        .select('*, Class ( name_class, reference_class, description_class )')
        .eq('id_login', authUser.id)
        .single();

    if (!profileData) redirect('/home');

    // 3. O SEGREDO DA VELOCIDADE: Buscar os 4 históricos em paralelo!
    const [
        { data: userWorks },
        { data: userRaids },
        { data: participatedData },
        { data: downloadedData }
    ] = await Promise.all([
        supabase.from('Work').select('*').eq('user_id', profileData.id).order('id', { ascending: false }),
        
        supabase.from('Meeting').select('*, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option)').eq('creator', profileData.id).order('meeting_date', { ascending: false }),
        
        supabase.from('User_Meeting').select(`id, rating, comment, Meeting ( *, group_category(option), plataform_meeting(option), meeting_tamplate(option), theme(option), User (user_name, last_name) )`).eq('id_user', profileData.id),
        
        supabase.from('User_Work').select(`id, rating, comment, Work ( *, User (user_name, last_name) )`).eq('id_user', profileData.id)
    ]);

    // 4. Tratamento dos dados (exatamente a mesma lógica que tinha no frontend)
    const joinedRaids = participatedData
        ?.filter(item => item.Meeting && item.Meeting.creator !== profileData.id)
        .map(item => ({ ...item.Meeting, user_meeting_id: item.id, user_rating: item.rating, user_comment: item.comment }))
        .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date)) || [];

    const joinedWorks = downloadedData
        ?.filter(item => item.Work && item.Work.user_id !== profileData.id)
        .map(item => ({ ...item.Work, user_work_id: item.id, user_rating: item.rating, user_comment: item.comment }))
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) || [];

    // 5. Entregar tudo pronto à interface
    return (
        <ProfileClientView 
            profile={profileData}
            initialWorks={userWorks || []}
            initialRaids={userRaids || []}
            initialParticipatedRaids={joinedRaids}
            initialDownloadedWorks={joinedWorks}
        />
    );
}