'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { meetingService } from '@/services/meeting.service';
import { PrimaryButton } from '@/components/UI/Form';

export default function ModalAgendamentosAtivos() {
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function loadRaids() {
      // Cria a instância específica para o navegador
      const supabase = createClient(); 
      
      try {
        // Passa a instância para o serviço
        const data = await meetingService.getActiveRaids(supabase); 
        setRaids(data);
      } catch (err) {
        console.error("Erro ao carregar raids:", err);
      } finally {
        // ESTA LINHA É ESSENCIAL para sair do estado de "Escaneando..."
        setLoading(false); 
      }
    }
    
    loadRaids();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-purple-400 animate-pulse uppercase text-xs font-black tracking-[0.3em]">
          Escaneando Raids Ativas...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 max-h-[80vh]">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Raids Disponíveis
        </h2>
        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-1">
          Sincronizado com o Radar da Guilda
        </p>
      </div>

      <div className="grid gap-4 overflow-y-auto pr-2 custom-scrollbar pb-4">
        {raids.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-purple-500/20 rounded-lg">
            <p className="text-gray-500 italic text-sm">Nenhuma raid ativa encontrada no radar...</p>
          </div>
        ) : (
          raids.map((raid) => (
            <div 
              key={raid.id} 
              className="relative p-5 bg-gray-950/50 border border-purple-500/20 rounded-lg group hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                    {raid.discipline}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-900/30 text-[9px] text-purple-300 font-bold rounded border border-purple-500/20 uppercase">
                      {raid.plataform_meeting}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Início</p>
                  <p className="text-sm font-bold text-white">
                    {new Date(raid.meeting_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {new Date(raid.meeting_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic mb-4 line-clamp-2 leading-relaxed border-l-2 border-purple-500/30 pl-3">
                "{raid.content}"
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-purple-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-black text-white shadow-lg">
                    {raid.User?.user_name?.[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-black uppercase tracking-wider">
                      {raid.User?.user_name}
                    </span>
                    <span className="text-[9px] text-purple-400 font-bold uppercase">
                      Líder do Grupo
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Duração</span>
                  <span className="text-xs font-bold text-gray-300">{raid.duration}</span>
                </div>
              </div>

              <PrimaryButton 
                style={{ marginTop: '1.25rem', padding: '0.6rem', fontSize: '0.75rem' }}
                onClick={() => alert('Entrada em Raid: Implementação em breve!')}
              >
                Solicitar Entrada
              </PrimaryButton>
            </div>
          ))
        )}
      </div>
    </div>
  );
}