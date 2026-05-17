import RankingList from './RankingList';

export default function RankingSection({ title, subtitle, icon: Icon, colorClass, data, currentUserId, onUserClick, onShowMore }) {
    return (
        <section>
            <div className={`flex items-center gap-3 mb-6 border-b border-gray-800 pb-4`}>
                <div className={`p-2 ${colorClass}/10 rounded-lg border ${colorClass}/20`}>
                    <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-200 tracking-tight">{title}</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{subtitle}</p>
                </div>
            </div>
            
            <RankingList 
                rankingData={data.slice(0, 5)} // Mostra o Top 5 na tela inicial em vez do Top 3
                emptyMessage="A guilda está inativa neste período. Nenhuma ação registada."
                currentUserId={currentUserId}
                onUserClick={onUserClick}
            />

            {data.length > 5 && (
                <button onClick={onShowMore} className={`w-full mt-4 py-3 border-2 border-dashed ${colorClass}/30 ${colorClass.replace('bg-', 'text-')} font-bold text-xs uppercase tracking-widest rounded-xl hover:${colorClass}/10 transition-all`}>
                    + Ver ranking completo ({data.length} membros)
                </button>
            )}
        </section>
    );
}