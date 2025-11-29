import React, { useMemo } from 'react';

const ExerciseTypeStats = ({ machines }) => {
  // Calcular conteo de máquinas por tipo de ejercicio
  const exerciseTypeCounts = useMemo(() => {
    const counts = {};
    machines.forEach(m => {
      const type = m.model?.exerciseCategory || 'Sin categoría';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [machines]);

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Distribución por Tipo</h3>
        <p className="text-xs text-gray-400 mt-1">
          Cantidad de máquinas por categoría de ejercicio
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          {Object.entries(exerciseTypeCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([type, count]) => (
              <div 
                key={type} 
                className="bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-3 flex items-center justify-between hover:border-yellow-500/30 transition-colors"
              >
                <p className="text-sm text-white font-medium capitalize">{type}</p>
                <p className="text-2xl font-bold text-yellow-500">{count}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTypeStats;
