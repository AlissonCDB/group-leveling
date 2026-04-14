'use client';
import { useEffect } from 'react';
import { User, Shield, Edit3, Trash2, MapPin, Briefcase, Users, ChevronRight } from 'lucide-react';




export default function Profile() {

    useEffect(() => {
        document.documentElement.classList.add('modal-open-raid');

        return () => {
            document.documentElement.classList.remove('modal-open-raid');
        };
    }, []);


    const userData = {
        name: "Arthur Pendragon",
        class: "Fullstack Paladin",
        classDescription: "Especialista em defender o código de bugs críticos e mestre em arquiteturas sagradas.",
        expertise: "Desenvolvimento Web & Cloud",
        works: [
            { id: 1, title: "Excalibur API", tech: "Node.js", xp: "+500 XP" },
            { id: 2, title: "Round Table UI", tech: "React", xp: "+300 XP" },
            { id: 3, title: "Grail Finder", tech: "Python", xp: "+450 XP" },
        ],
        groups: [
            { id: 1, name: "Mestres do TypeScript", role: "Criador", members: 12 },
            { id: 2, name: "Design Patterns 101", role: "Membro", members: 45 },
            { id: 3, name: "Next.js Wizards", role: "Criador", members: 8 },
        ]
    };

    return (
        <div className="flex flex-col h-svh w-screen justify-between items-center bg-slate-950 text-slate-100 ">

            {/* Card Principal de Perfil */}
            <section className="flex flex-col w-full justify-between h-[45%] bg-slate-900 rounded-3xl shadow-2xl">
                <div className="flex items-end justify-center h-[20%] mb-12 bg-linear-to-r from-indigo-600 to-purple-600 ">
                    <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-900 translate-y-12 flex items-center justify-center">
                        <User size={48} className="text-slate-400" />
                    </div>
                </div>

                <div className="flex flex-col w-screen h-[80%] items-center justify-center text-center ">
                    <h1 className="text-3xl font-bold tracking-tight">{userData.name}</h1>
                    <div className="flex items-center justify-center gap-2 mt-1 text-indigo-400 font-semibold uppercase text-sm tracking-widest">
                        <Shield size={16} />
                        <span>{userData.class}</span>
                    </div>
                    <p className="mt-4 text-slate-400 text-sm italic leading-relaxed max-w-md mx-auto">
                        "{userData.classDescription}"
                    </p>

                    <div className="flex w-full items-center justify-around mt-4">
                        <div className='w-[10%]'></div>
                        <div className="flex flex-col items-center text-left w-[80%]">
                            <span className="text-[10px] text-slate-500 uppercase font-black flex items-center justify-around">
                                <MapPin size={10} /> Área de atuação
                            </span>
                            <h2 className="text-slate-200 font-medium">{userData.expertise}</h2>
                        </div>
                        <button className="w-[10%] h-full flex items-center justify-center hover:bg-indigo-500/20 rounded-xl transition-colors text-indigo-400 border border-transparent hover:border-indigo-500/30">
                            <Edit3 size={15} />
                        </button>
                    </div>
                </div>
            </section>

            <div className='h-[45%] w-full flex flex-col md:flex-row'>
                {/* Seção: Trabalhos Adicionados (Carrossel) */}
                <section className='flex flex-col w-full h-[50%] md:h-full '>
                    <div className="flex w-full items-center justify-between">
                        <h3 className="flex items-center gap-2 font-bold text-slate-300">
                            <Briefcase size={18} className="text-indigo-500" />
                            Trabalhos Adicionados
                        </h3>
                        <button className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                            Ver todos <ChevronRight size={12} />
                        </button>
                    </div>

                    <div className="flex w-full h-[90%] overflow-x-auto scrollbar-hide snap-x">
                        {userData.works.map(work => (
                            <div key={work.id} className="flex flex-col min-w-[60%] bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase">{work.tech}</span>
                                <h4 className="text-slate-100 font-bold group-hover:text-indigo-400 transition-colors">{work.title}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Seção: Grupos de Estudos (Carrossel) */}
                <section className='w-screen h-[50%] md:h-full'>
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-bold text-slate-300">
                            <Users size={18} className="text-purple-500" />
                            Grupos de Estudos
                        </h3>
                    </div>

                    <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x">
                        {userData.groups.map(group => (
                            <div key={group.id} className="min-w-240px snap-start bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-slate-100 font-bold leading-tight">{group.name}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${group.role === 'Criador' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-slate-600 text-slate-400'}`}>
                                        {group.role}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <Users size={12} />
                                    <span>{group.members} membros ativos</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>


            {/* Footer de Perigo */}
            <button className="w-full h-[10%] flex items-center justify-center text-slate-600 hover:text-red-500 text-sm font-medium border-t border-slate-900 transition-all">
                <Trash2 size={14} />
                Encerrar jornada e deletar conta
            </button>
        </div>
    );
}