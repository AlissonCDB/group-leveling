import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { userService } from '@/services/user.service';
import { workService } from '@/services/work.service';
import { meetingService } from '@/services/meeting.service';
import ProfileClientView from '@/features/profile/ProfileClientView';

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1 e 2. Validar Sessão e Buscar Dados (encapsulado no service)
    const profileData = await userService.getAuthenticatedProfile(supabase);
    
    // Se não tiver perfil (ou não estiver logado), redireciona
    if (!profileData) redirect('/');

    // 3 e 4. Buscar Históricos em paralelo (lógica de tratamento já embutida nos services)
    const [
        userWorks,
        userRaids,
        joinedRaids,
        joinedWorks
    ] = await Promise.all([
        workService.getUserWorks(supabase, profileData.id),
        meetingService.getUserMeetings(supabase, profileData.id),
        meetingService.getParticipatedMeetings(supabase, profileData.id),
        workService.getDownloadedWorks(supabase, profileData.id)
    ]);

    // 5. Entregar tudo pronto à interface
    return (
        <ProfileClientView 
            profile={profileData}
            initialWorks={userWorks}
            initialRaids={userRaids}
            initialParticipatedRaids={joinedRaids}
            initialDownloadedWorks={joinedWorks}
        />
    );
}