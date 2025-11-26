import React from 'react';

const MAX_SELECTED_MACHINES = 4;

const MachineComparisonTable = ({ machines, selectedMachines = [], onToggleMachine }) => {
  const toggleMachine = (machine) => {
    onToggleMachine(machine);
  };

  const isSelected = (machineId) => {
    return selectedMachines.some(m => m.id === machineId);
  };

  return (
    <article className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Comparativa de Máquinas</h3>
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-3 px-2 pb-2 mb-2 border-b border-[#333]">
        <p className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Máquina</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Uptime (%)
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Coste (%)
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Riesgo Fallo
          </p>
          <div className="w-5" /> {/* Spacer for checkbox */}
        </div>
      </div>

      <div className="space-y-1">
        {machines.map((machine) => (
          <div
            key={machine.id}
            onClick={() => toggleMachine(machine)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              isSelected(machine.id) 
                ? "bg-yellow-500/10 border border-yellow-500/30" 
                : "hover:bg-[#2a2a2a]/50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {machine.model?.name} - {machine.location}
              </p>
              <p className="text-[10px] text-gray-500">
                {machine.model?.brand}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-32">
                <UptimeCell value={machine.kpis?.equipmentUptime} />
              </div>
              <div className="w-32">
                <CostCell value={machine.kpis?.maintenanceCostRelative} />
              </div>
              <div className="w-32">
                <RiskCell days={machine.kpis?.diasDespuesDeFallo} />
              </div>
              <input
                type="checkbox"
                checked={isSelected(machine.id)}
                onChange={() => {}}
                className="w-5 h-5 cursor-pointer pointer-events-none rounded border-[#333] bg-[#1f1f1f] text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedMachines.length === MAX_SELECTED_MACHINES && (
        <p className="text-xs text-orange-400 mt-2">
          Máximo {MAX_SELECTED_MACHINES} máquinas seleccionadas
        </p>
      )}
    </article>
  );
};

// Función para obtener el color según el uptime
const getUptimeColor = (value) => {
  if (!value) return "text-gray-400";
  if (value >= 85) return "text-green-500"; // Excelente
  if (value >= 70) return "text-yellow-500"; // Bueno
  return "text-red-500"; // Necesita atención
};

// Función para obtener el color según el coste
const getCostColor = (value) => {
  if (!value) return "text-gray-400";
  if (value < 10) return "text-green-500"; // Aceptable
  if (value < 20) return "text-yellow-500"; // Moderado
  return "text-red-500"; // Alto - considerar reemplazo
};

// Función para obtener el color según el riesgo
const getRiskColor = (days) => {
  if (!days) return "text-gray-400";
  // Convertir días a probabilidad aproximada
  // 15 días = 50% probabilidad
  const probability = Math.max(0, Math.min(100, ((30 - days) / 30) * 100));
  
  if (probability < 40) return "text-green-500"; // Mínima
  if (probability < 70) return "text-yellow-500"; // Media
  return "text-red-500"; // Alta
};

const getRiskLabel = (days) => {
  if (!days) return 'N/A';
  const probability = Math.max(0, Math.min(100, ((30 - days) / 30) * 100));
  
  if (probability < 40) return 'Baja';
  if (probability < 70) return 'Media';
  return 'Alta';
};

// Componente para celdas de Uptime
const UptimeCell = ({ value }) => {
  return (
    <p className={`text-center text-sm font-bold ${getUptimeColor(value)}`}>
      {value ? `${value.toFixed(1)}%` : '-'}
    </p>
  );
};

// Componente para celdas de Coste
const CostCell = ({ value }) => {
  return (
    <p className={`text-center text-sm font-bold ${getCostColor(value)}`}>
      {value ? `${value.toFixed(1)}%` : '-'}
    </p>
  );
};

// Componente para celdas de Riesgo
const RiskCell = ({ days }) => {
  return (
    <p className={`text-center text-sm font-bold ${getRiskColor(days)}`}>
      {getRiskLabel(days)}
    </p>
  );
};

export default MachineComparisonTable;
