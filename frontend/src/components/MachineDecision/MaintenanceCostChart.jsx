import React from 'react';

const MaintenanceCostChart = ({ machines }) => {
  if (!machines || machines.length === 0) {
    return (
      <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Mantener vs Cambiar
        </h3>
        <p className="text-gray-400 text-center py-8">Selecciona máquinas para comparar</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Mantener vs Cambiar
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Comparación con punto de decisión de reemplazo (100%)
        </p>
      </div>

      <div className="space-y-8">
        {machines.map((machine) => {
          const costPercentage = machine.kpis?.maintenanceCostRelative || 0;
          const shouldReplace = costPercentage >= 100;
          const barWidth = Math.min((costPercentage / 200) * 100, 100); // Escala de 0-200%

          return (
            <div key={machine.id} className="space-y-2">
              {/* Nombre de la máquina */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {machine.model?.name || 'N/A'} - {machine.location}
                  </p>
                  <p className="text-xs text-gray-500">{machine.model?.brand}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getCostColor(costPercentage)}`}>
                    {costPercentage.toFixed(1)}%
                  </p>
                  <p className={`text-xs ${shouldReplace ? 'text-red-400' : 'text-green-400'}`}>
                    {shouldReplace ? '→ Cambiar' : '→ Mantener'}
                  </p>
                </div>
              </div>

              {/* Barra horizontal */}
              <div className="relative h-8 bg-[#2a2a2a] rounded-lg overflow-hidden">
                {/* Línea del 100% (punto medio) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10"></div>
                <div className="absolute left-1/2 -top-6 text-[10px] text-white font-semibold transform -translate-x-1/2">
                  100% (Decisión)
                </div>

                {/* Barra de progreso */}
                <div
                  className={`h-full transition-all duration-500 ${
                    shouldReplace 
                      ? 'bg-gradient-to-r from-yellow-500 to-red-500' 
                      : 'bg-gradient-to-r from-green-500 to-yellow-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                ></div>

                {/* Etiquetas de 0% y 200% */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  0%
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  200%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Función auxiliar para obtener el color según el coste
const getCostColor = (value) => {
  if (!value) return "text-gray-400";
  if (value < 10) return "text-green-500";
  if (value < 20) return "text-yellow-500";
  if (value < 100) return "text-orange-500";
  return "text-red-500";
};

export default MaintenanceCostChart;
