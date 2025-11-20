import React from 'react';
import { useKPIStatus } from '../../hooks/useKPIStatus';

const TRAINER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
];

const SelectedTrainerSummaryList = ({ trainers, onRemoveTrainer }) => {
  if (trainers.length === 0) return null;

  return (
    <aside className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.slice(0, 3).map((trainer, idx) => {
        const trceStatus = useKPIStatus(trainer.kpis.trce, 'TRCE');
        const isacStatus = useKPIStatus(trainer.kpis.isac, 'ISAC');
        const reddStatus = useKPIStatus(trainer.kpis.redd, 'REDD');

        return (
          <article 
            key={trainer.id}
            className="bg-white rounded-lg shadow-md p-4 border-t-4 relative"
            style={{ borderTopColor: TRAINER_COLORS[idx] }}
          >
            <header className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{trainer.username}</h3>
                <p className="text-xs text-gray-500">{trainer.email}</p>
              </div>
              <button
                onClick={() => onRemoveTrainer(trainer)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Quitar ${trainer.username}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <section className="space-y-2">
              {/* TRCE */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">TRCE</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${trceStatus.color}`}>
                    {trainer.kpis.trce}%
                  </span>
                  <span className="text-lg">{trceStatus.icon}</span>
                </div>
              </div>

              {/* ISAC */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ISAC</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isacStatus.color}`}>
                    {trainer.kpis.isac}%
                  </span>
                  <span className="text-lg">{isacStatus.icon}</span>
                </div>
              </div>

              {/* REDD */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">REDD</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${reddStatus.color}`}>
                    {trainer.kpis.redd}%
                  </span>
                  <span className="text-lg">{reddStatus.icon}</span>
                </div>
              </div>

              {/* Score Global */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Score Global</span>
                <span className="font-bold text-lg text-gray-900">
                  {trainer.kpis.globalScore}%
                </span>
              </div>
            </section>
          </article>
        );
      })}
    </aside>
  );
};

export default SelectedTrainerSummaryList;
