import React, { useState } from 'react';
import { useKPIStatus } from '../../hooks/useKPIStatus';

const MAX_SELECTED_TRAINERS = 3;

const TrainerComparisonTable = ({ trainers, selectedTrainers = [], onToggleTrainer }) => {
  const toggleTrainer = (trainer) => {
    onToggleTrainer(trainer);
  };

  const isSelected = (trainerId) => {
    return selectedTrainers.some(t => t.id === trainerId);
  };

  return (
    <article className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Comparativa de Entrenadores</h3>
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-3 px-2 pb-2 mb-2 border-b border-[#333]">
        <p className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Entrenador</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            TRCE
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            ISAC
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            REDD
          </p>
          <div className="w-5" /> {/* Spacer for checkbox */}
        </div>
      </div>

      <div className="space-y-1">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            onClick={() => toggleTrainer(trainer)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              isSelected(trainer.id) 
                ? "bg-yellow-500/10 border border-yellow-500/30" 
                : "hover:bg-[#2a2a2a]/50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{trainer.username}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-32">
                <KPICell value={trainer.kpis?.trce} />
              </div>
              <div className="w-32">
                <KPICell value={trainer.kpis?.isac} />
              </div>
              <div className="w-32">
                <KPICell value={trainer.kpis?.redd} />
              </div>
              <input
                type="checkbox"
                checked={isSelected(trainer.id)}
                onChange={() => {}}
                className="w-5 h-5 cursor-pointer pointer-events-none rounded border-[#333] bg-[#1f1f1f] text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedTrainers.length === MAX_SELECTED_TRAINERS && (
        <p className="text-xs text-orange-400 mt-2">
          Máximo {MAX_SELECTED_TRAINERS} entrenadores seleccionados
        </p>
      )}
    </article>
  );
};

// Función para obtener el color según el valor del KPI (escala 0-10)
const getKPIColor = (value) => {
  if (!value) return "text-gray-400";
  if (value >= 8) return "text-green-500"; // Excelente (8-10)
  if (value >= 6) return "text-yellow-500"; // Bueno (6-8)
  return "text-red-500"; // Necesita mejora (0-6)
};

// Componente para celdas de KPI con colores
const KPICell = ({ value }) => {
  return (
    <p className={`text-center text-sm font-bold ${getKPIColor(value)}`}>
      {value ? value.toFixed(1) : '-'}
    </p>
  );
};

export default TrainerComparisonTable;
