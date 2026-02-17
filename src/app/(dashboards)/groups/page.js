'use client'

import { useState } from 'react'
import Image from 'next/image'
import ModalAgendamento from './ModalAgendamento.js'


function ModalAgendados({ onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
            <div className="bg-white text-black p-6 rounded-lg w-full max-w-md shadow-xl relative">
                <h2 className="text-xl font-bold mb-4">Raids Ativas</h2>
                <p className="mb-4">Lista de grupos...</p>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition rounded-lg"
                >
                    Fechar
                </button>
            </div>
        </div>
    )
}

export default function GroupsPage() {
    const [activeModal, setActiveModal] = useState(null);

    // Estilo base da caixa de texto sobreposta
    const overlayBoxStyle = "flex flex-col items-center justify-center text-white text-center border-2 border-purple-500 rounded-xl p-8 backdrop-blur-sm bg-black/40 transition-all duration-500 group-hover:bg-purple-600/90 group-hover:scale-105 group-hover:border-purple-300 shadow-lg";

    return (
        <div className="flex w-screen h-screen relative bg-gray-900">

            {/* === LADO ESQUERDO: Buscar Grupo (50% width) === */}
            <button
                onClick={() => setActiveModal('agendados')}
                className="group relative w-1/2 h-full p-0 overflow-hidden text-left focus:outline-none"
            >
                {/* Imagem de Fundo (Preenche o espaço) */}
                <Image
                    src="/assets/entrarGrupo.png"
                    alt="Fundo Entrar em Raid"
                    fill
                    priority // Carrega mais rápido por ser visível imediatamente
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Overlay Escuro para melhorar leitura inicial */}
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:opacity-10"></div>

                {/* Conteúdo Centralizado (Texto sobreposto) */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className={overlayBoxStyle}>
                        <p className="font-extrabold text-3xl md:text-4xl uppercase tracking-wider mb-2 drop-shadow-lg">
                            Raids Ativas
                        </p>
                        <p className="text-sm md:text-base font-medium opacity-90 tracking-wide">
                            Buscar grupo de estudo
                        </p>
                        {/* Ícone opcional para dar um toque visual */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mt-4 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Linha Divisória Sutil (Opcional, remova se não quiser) */}
            <div className="absolute left-1/2 h-full w-2px bg-purple-500/50 z-10 hidden md:block"></div>


            {/* === LADO DIREITO: Criar Grupo (50% width) === */}
            <button
                onClick={() => setActiveModal('agendar')}
                className="group relative w-1/2 h-full p-0 overflow-hidden text-left focus:outline-none"
            >
                {/* Imagem de Fundo */}
                <Image
                    src="/assets/criarGrupo.png"
                    alt="Fundo Criar Raid"
                    fill
                    priority
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1"
                />

                {/* Overlay Escuro */}
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:opacity-10"></div>

                {/* Conteúdo Centralizado */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className={overlayBoxStyle}>
                        <p className="font-extrabold text-3xl md:text-4xl uppercase tracking-wider mb-2 drop-shadow-lg">
                            Agendar Raid
                        </p>
                        <p className="text-sm md:text-base font-medium opacity-90 tracking-wide">
                            Criar grupo de estudo
                        </p>
                        {/* Ícone opcional */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mt-4 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Modais */}
            {activeModal === 'agendados' && <ModalAgendados onClose={() => setActiveModal(null)} />}
            {activeModal === 'agendar' && <ModalAgendamento onClose={() => setActiveModal(null)} />}
        </div>
    )
}