import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PublicProfileClientView from '@/features/profile/PublicProfileClientView';

export default async function PublicProfilePage({ params }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: user, error: userErr } = await supabase
        .from('User')
        .select('*, Class(name_class)')
        .eq('id', id)
        .single();

    if (userErr || !user) redirect('/home'); 

    // Trabalhos
    const { data: worksData } = await supabase
        .from('Work')
        .select('*, User_Work(rating)')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
    
    const processedWorks = (worksData || []).map(work => {
        const ratings = Array.isArray(work.User_Work) ? work.User_Work : (work.User_Work ? [work.User_Work] : []);
        let totalScore = 0, count = 0;
        ratings.forEach(r => {
            if (r && r.rating !== null && r.rating !== undefined) { 
                totalScore += Number(r.rating); 
                count++; 
            }
        });
        return { ...work, totalScore, hasRatings: count > 0 };
    });

    // Raids
    const { data: meetingsData } = await supabase
        .from('Meeting')
        .select('*, User_Meeting(rating)')
        .eq('creator', id) 
        .order('meeting_date', { ascending: false });

    const processedMeetings = (meetingsData || []).map(raid => {
        const ratings = Array.isArray(raid.User_Meeting) ? raid.User_Meeting : (raid.User_Meeting ? [raid.User_Meeting] : []);
        let totalScore = 0, count = 0;
        ratings.forEach(r => {
            if (r && r.rating !== null && r.rating !== undefined) { 
                totalScore += Number(r.rating); 
                count++; 
            }
        });
        return { ...raid, totalScore, hasRatings: count > 0 };
    });

    return (
        <PublicProfileClientView 
            userData={user} 
            works={processedWorks} 
            meetings={processedMeetings} 
        />
    );
}