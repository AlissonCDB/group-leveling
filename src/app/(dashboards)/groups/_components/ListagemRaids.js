'use client';

export default function ListagemRaids() {
  // Simulação de dados da guilda
  const raids = [
    { id: 1, materia: 'Cálculo I', leader: 'Arqueiro_Verde', players: '3/5' },
    { id: 2, materia: 'Estrutura de Dados', leader: 'Mago_Bits', players: '1/4' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
          Raids Ativas
        </h3>
        <p className="text-xs text-purple-400 uppercase tracking-widest mt-1">
          Selecione uma missão para se juntar
        </p>
      </div>

      <div className="space-y-3">
        {raids.map((raid) => (
          <div 
            key={raid.id} 
            className="group p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <p className="text-purple-100 font-bold">{raid.materia}</p>
              <p className="text-[10px] text-purple-400 uppercase tracking-widest">Líder: {raid.leader}</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <span className="text-xs font-mono text-purple-300">{raid.players}</span>
              <button className="text-[10px] font-black bg-purple-600 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                Entrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}