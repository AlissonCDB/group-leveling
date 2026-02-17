'use client'

import { useState } from 'react'

export default function ModalAgendamento({ onClose }) {
    // Estado para armazenar os dados do formulário baseados no seu diagrama
    const [formData, setFormData] = useState({
        meeting_date: '',
        plataform_meeting: '',
        disciplina: '',
        conteudo: '',
        tempo_estimado: ''
    })

    // Função para atualizar o estado quando o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Função de envio (Simulação)
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita recarregar a página
        console.log("Dados da Raid para enviar ao Backend:", formData);
        // Aqui você chamaria sua API futuramente
        onClose();
    }

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 backdrop-blur-sm"
            onClick={onClose} // Fecha ao clicar fora
        >
            <div 
                className="bg-white text-gray-800 p-6 rounded-xl w-full max-w-lg shadow-2xl relative"
                onClick={(e) => e.stopPropagation()} // Impede que o clique dentro feche o modal
            >
                <div className="mb-6 border-b pb-2 border-gray-200">
                    <h2 className="text-2xl font-extrabold text-purple-700">Agendar Nova Raid</h2>
                    <p className="text-sm text-gray-500">Preencha os dados para criar seu grupo de estudo.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Linha 1: Disciplina e Plataforma */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Disciplina</label>
                            <input 
                                type="text" 
                                name="disciplina"
                                placeholder="Ex: Cálculo 1"
                                value={formData.disciplina}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Plataforma</label>
                            <input 
                                type="text" 
                                name="plataform_meeting"
                                placeholder="Ex: Discord, Meet"
                                value={formData.plataform_meeting}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Linha 2: Data/Hora e Tempo Estimado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Data e Hora</label>
                            <input 
                                type="datetime-local" 
                                name="meeting_date"
                                value={formData.meeting_date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition text-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Duração Estimada</label>
                            <input 
                                type="text" 
                                name="tempo_estimado"
                                placeholder="Ex: 1h 30min"
                                value={formData.tempo_estimado}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Linha 3: Conteúdo (Textarea) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo / Detalhes</label>
                        <textarea 
                            name="conteudo"
                            rows="3"
                            placeholder="Descreva brevemente o que será estudado..."
                            value={formData.conteudo}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
                        >
                            Confirmar Raid
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}