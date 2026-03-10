'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PrimaryButton } from '@/components/UI/Form';

export default function ModalTrabalhosDisponiveis() {
  const [trabalhos, setTrabalhos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWork() {
      const supabase = createClient(); 
      
      try {
        const { data, error } = await supabase
          .from('Work') 
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setTrabalhos(data || []);
      } catch (err) {
        console.error("Erro ao carregar do radar Work:", err);
      } finally {
        setLoading(false); 
      }
    }
    
    loadWork();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-purple-400 animate-pulse uppercase text-xs font-black tracking-[0.3em]">
          Sincronizando Banco de Dados "Work"...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[80vh]">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Trabalhos Disponíveis
        </h2>
        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-1">
          Tabela Ativa
        </p>
      </div>

      <div className="grid gap-4 overflow-y-auto pr-2 custom-scrollbar pb-4">
        {trabalhos.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-purple-500/20 rounded-lg">
            <p className="text-gray-500 italic text-sm">Nenhum arquivo encontrado...</p>
          </div>
        ) : (
          trabalhos.map((item) => (
            <div 
              key={item.id} 
              className="relative p-5 bg-gray-950/50 border border-purple-500/20 rounded-lg group hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                    {item.subject}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-900/30 text-[9px] text-purple-300 font-bold rounded border border-purple-500/20 uppercase">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-900/30 text-[9px] text-indigo-300 font-bold rounded border border-indigo-500/20 uppercase">
                      {item.graduation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Job ID</p>
                  <p className="text-sm font-bold text-white">#{item.id}</p>
                </div>
              </div>

              {/* Botão de Download do Arquivo real */}
              <div className="mt-4 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center text-purple-400">
                      📄
                   </div>
                   <span className="text-[10px] text-gray-400 uppercase font-mono truncate max-w-[150px]">
                      {item.archive.split('/').pop()}
                   </span>
                </div>

                <a 
                  href={item.archive} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  Baixar Arquivo
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}