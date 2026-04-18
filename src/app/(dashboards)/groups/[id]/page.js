'use client';

import React, { useState, useEffect, useActionState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Clock, MapPin, Wifi, Users, Send, MessageSquare, MonitorPlay, Layers } from 'lucide-react';
import { postCommentAction } from '@/app/actions';
import { PrimaryButton } from '@/components/UI/Form';

export default function RaidRoomPage() {
    const params = useParams();
    const raidId = params.id;

    const [raid, setRaid] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState(''); // Para limpar o input

    const [state, action, isPending] = useActionState(postCommentAction, undefined);
    const messagesEndRef = useRef(null);

    // Função para rolar o chat para baixo
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        async function loadRoomData() {
            const supabase = createClient();
            try {
                // 1. Identificar Utilizador
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { data: userData } = await supabase.from('User').select('id').eq('id_login', authUser.id).single();
                    if (userData) setCurrentUserId(userData.id);
                }

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
                setRaid(raidData);

                // 3. Buscar Comentários Iniciais (CORRIGIDO PARA BUSCAR A COLUNA 'text')
                const { data: commentsData } = await supabase
                    .from('Comments')
                    .select(`
                        id, created_at, text, user_id, 
                        User:user_id ( user_name, last_name, Class ( name_class ) )
                    `)
                    .eq('meeting_id', raidId)
                    .order('created_at', { ascending: true });
                setComments(commentsData || []);

            } catch (err) {
                console.error("Erro ao carregar sala:", err);
            } finally {
                setLoading(false);
            }
        }
        loadRoomData();
    }, [raidId, state]); // Recarrega os comentários quando o state (action) muda

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    useEffect(() => {
        if (state?.success) setCommentText(''); // Limpa o input se enviar com sucesso
    }, [state]);

    if (loading) {
        return (
            <div className="flex w-screen h-screen items-center justify-center bg-gray-950">
                <p className="text-purple-400 animate-pulse uppercase text-sm font-black tracking-[0.3em]">A Sincronizar Sala...</p>
            </div>
        );
    }

    if (!raid) return <div className="text-white">Raid não encontrada.</div>;

    const isPresencial = raid.meeting_tamplate?.option?.toLowerCase().includes('presencial');

    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans bg-gray-950">

            {/* PAINEL ESQUERDO: Informações da Raid */}
            <div className="relative w-full md:w-1/3 h-auto md:h-full bg-purple-900 flex flex-col p-8 text-white transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-10 overflow-y-auto scrollbar-hide">
                <div className="absolute inset-0 bg-black/40 z-0" />
                <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center opacity-10 mix-blend-overlay z-0" />

                <div className="relative z-10 flex flex-col h-full">

                    <div className="flex items-center gap-2 mb-6">
                        <Users size={24} className="text-purple-400" />
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Sala de Missão</span>
                    </div>

                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg text-white">
                        {raid.theme?.option || 'Sem Tema'}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-amber-900/30 text-[10px] text-amber-400 font-bold rounded border border-amber-500/30 uppercase flex items-center gap-1">
                            <Layers size={12} /> {raid.group_category?.option}
                        </span>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded border uppercase flex items-center gap-1 ${!isPresencial ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'}`}>
                            {!isPresencial ? <Wifi size={12} /> : <MapPin size={12} />} {raid.meeting_tamplate?.option}
                        </span>
                        <span className="px-3 py-1 bg-purple-900/30 text-[10px] text-purple-300 font-bold rounded border border-purple-500/30 uppercase flex items-center gap-1">
                            <MonitorPlay size={12} /> {raid.plataform_meeting?.option}
                        </span>
                    </div>

                    <div className="bg-gray-900/60 p-4 rounded-xl border border-purple-500/30 mb-6 backdrop-blur-sm">
                        <p className="text-sm text-gray-300 italic leading-relaxed">"{raid.content}"</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-gray-300 text-sm bg-black/40 p-3 rounded-lg border border-gray-800">
                            <Calendar size={18} className="text-purple-500" />
                            <span><strong className="text-white uppercase text-[10px] tracking-widest block mb-0.5">Data</strong> {new Date(raid.meeting_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm bg-black/40 p-3 rounded-lg border border-gray-800">
                            <Clock size={18} className="text-purple-500" />
                            <span><strong className="text-white uppercase text-[10px] tracking-widest block mb-0.5">Horário</strong> {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ({raid.duration})</span>
                        </div>
                        {raid.adress && (
                            <div className="flex items-center gap-3 text-gray-300 text-sm bg-black/40 p-3 rounded-lg border border-gray-800 break-all">
                                {!isPresencial ? <Wifi size={18} className="text-purple-500 shrink-0" /> : <MapPin size={18} className="text-purple-500 shrink-0" />}
                                <span><strong className="text-white uppercase text-[10px] tracking-widest block mb-0.5">{!isPresencial ? 'Link da Reunião' : 'Local'}</strong> {raid.adress}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-purple-500/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-lg font-black text-white shadow-lg">
                            {raid.User?.user_name?.[0].toUpperCase() || '?'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Líder da Missão</span>
                            <span className="text-sm text-white font-black uppercase tracking-wider">{raid.User?.user_name} {raid.User?.last_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAINEL DIREITO: Chat / Comentários */}
            <div className="w-full md:w-2/3 h-full flex flex-col bg-gray-950 relative">

                {/* Header do Chat */}
                <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3 shrink-0">
                    <MessageSquare size={20} className="text-purple-500" />
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Comunicações do Esquadrão</h2>
                </div>

                {/* Lista de Mensagens */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <MessageSquare size={48} className="mb-4" />
                            <p className="italic text-sm">A sala está silenciosa. Seja o primeiro a falar.</p>
                        </div>
                    ) : (
                        comments.map((comment) => {
                            const isMe = comment.user_id === currentUserId;
                            return (
                                <div key={comment.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in-fast`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{comment.User?.user_name}</span>
                                        <span className="text-[8px] text-gray-600">{new Date(comment.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={`max-w-[80%] md:max-w-[60%] p-3 text-sm rounded-2xl ${isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'}`}>

                                        {/* AQUI ESTÁ A CORREÇÃO: Usar comment.text */}
                                        {comment.text}

                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input de Comentário */}
                <div className="p-4 md:p-6 bg-gray-900 border-t border-gray-800 shrink-0 pb-24 md:pb-6">
                    <form action={action} className="flex gap-3">
                        <input type="hidden" name="meeting_id" value={raidId} />
                        <input
                            type="text"
                            name="content"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escreva a sua mensagem para o grupo..."
                            className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all placeholder:text-gray-600"
                            autoComplete="off"
                            required
                        />
                        <PrimaryButton type="submit" disabled={isPending} style={{ width: 'auto', padding: '0 1.5rem', margin: 0, borderRadius: '0.75rem' }}>
                            {isPending ? '...' : <Send size={18} />}
                        </PrimaryButton>
                    </form>
                    {state?.success === false && <p className="text-red-400 text-[10px] font-bold mt-2 animate-pulse">{state.message}</p>}
                </div>
            </div>

        </div>
    );
}