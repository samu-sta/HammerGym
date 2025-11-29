import React, { useState, useMemo } from 'react';

const MAX_SELECTED_MACHINES = 4;

const MachineComparisonTable = ({ 
  machines, 
  selectedMachines = [], 
  onToggleMachine,
  selectedForAction = {},
  onActionSelection,
  maintenanceBudget = 0,
  remainingBudget = 0
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const toggleMachine = (machine) => {
    onToggleMachine(machine);
  };

  const isSelected = (machineId) => {
    return selectedMachines.some(m => m.id === machineId);
  };

  const canAffordMaintenance = (machine) => {
    const maintenanceCost = parseFloat(machine.model?.fixedMaintenancePrice || 0);
    return remainingBudget >= maintenanceCost;
  };

  const canAffordReplacement = (machine) => {
    const replacementCost = parseFloat(machine.replacementValue || 0);
    return remainingBudget >= replacementCost;
  };

  const handleMaintenanceCheck = (e, machine) => {
    e.stopPropagation();
    if (!canAffordMaintenance(machine) && !selectedForAction[machine.id]?.maintenance) {
      alert('Presupuesto insuficiente para este mantenimiento');
      return;
    }
    onActionSelection(machine.id, 'maintenance');
  };

  const handleReplacementCheck = (e, machine) => {
    e.stopPropagation();
    if (!canAffordReplacement(machine) && !selectedForAction[machine.id]?.replacement) {
      alert('El costo de sustitución excede el presupuesto total');
      return;
    }
    onActionSelection(machine.id, 'replacement');
  };

  const handleComparisonCheck = (e, machine) => {
    e.stopPropagation();
    toggleMachine(machine);
  };

  const getRecommendation = (costRelative) => {
    if (!costRelative) return 'N/A';
    return costRelative < 100 ? 'MANTENER' : 'SUSTITUIR';
  };

  const getRecommendationColor = (costRelative) => {
    if (!costRelative) return 'text-gray-400';
    return costRelative < 100 ? 'text-green-500' : 'text-red-500';
  };

  // Función para ordenar
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Calcular conteo de máquinas por tipo de ejercicio
  const exerciseTypeCounts = useMemo(() => {
    const counts = {};
    machines.forEach(m => {
      const type = m.model?.exerciseCategory || 'Sin categoría';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [machines]);

  // Ordenar máquinas
  const sortedMachines = useMemo(() => {
    let sorted = [...machines];

    // Aplicar ordenamiento
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'exerciseType':
            aValue = a.model?.exerciseCategory || '';
            bValue = b.model?.exerciseCategory || '';
            break;
          case 'utilization':
            aValue = a.kpis?.equipmentUptime || 0;
            bValue = b.kpis?.equipmentUptime || 0;
            break;
          case 'recommendation':
            aValue = a.kpis?.maintenanceCostRelative || 0;
            bValue = b.kpis?.maintenanceCostRelative || 0;
            break;
          case 'failureDays':
            aValue = a.kpis?.diasDespuesDeFallo || 0;
            bValue = b.kpis?.diasDespuesDeFallo || 0;
            break;
          case 'rarity':
            aValue = a.kpis?.rarityIndex || 0;
            bValue = b.kpis?.rarityIndex || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [machines, sortConfig]);

  return (
    <article className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Selección de Máquinas</h3>
        <p className="text-xs text-gray-400">
          {machines.length} máquina{machines.length !== 1 ? 's' : ''} disponible{machines.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-[#333]">
        <p className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Máquina</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleSort('exerciseType')}
            className="w-24 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide hover:text-white cursor-pointer transition-colors"
          >
            Tipo {sortConfig.key === 'exerciseType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('utilization')}
            className="w-24 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide hover:text-white cursor-pointer transition-colors"
          >
            Utilización {sortConfig.key === 'utilization' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('recommendation')}
            className="w-28 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide hover:text-white cursor-pointer transition-colors"
          >
            Recomendación {sortConfig.key === 'recommendation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('failureDays')}
            className="w-28 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide hover:text-white cursor-pointer transition-colors"
          >
            Fallo estimado {sortConfig.key === 'failureDays' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('rarity')}
            className="w-24 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide hover:text-white cursor-pointer transition-colors"
          >
            Rareza {sortConfig.key === 'rarity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Mantenimiento
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Sustitución
          </p>
          <p className="w-20 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Análisis
          </p>
        </div>
      </div>

      <div className="space-y-1 max-h-[800px] overflow-y-auto">
        {sortedMachines.map((machine) => {
          const maintenanceCost = parseFloat(machine.model?.fixedMaintenancePrice || 0);
          const replacementCost = parseFloat(machine.replacementValue || 0);
          const isMaintenanceChecked = selectedForAction[machine.id]?.maintenance || false;
          const isReplacementChecked = selectedForAction[machine.id]?.replacement || false;
          
          return (
            <div
              key={machine.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#2a2a2a]/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {machine.model?.name} - {machine.location}
                </p>
                <p className="text-[10px] text-gray-500">
                  {machine.model?.brand}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-24">
                  <ExerciseTypeCell value={machine.model?.exerciseCategory} />
                </div>
                <div className="w-24">
                  <UptimeCell value={machine.kpis?.equipmentUptime} />
                </div>
                <div className="w-28">
                  <RecommendationCell value={machine.kpis?.maintenanceCostRelative} />
                </div>
                <div className="w-28">
                  <DaysCell days={machine.kpis?.diasDespuesDeFallo} />
                </div>
                <div className="w-24">
                  <RarityIndexCell value={machine.kpis?.rarityIndex} />
                </div>
                
                {/* Mantenimiento - Checkbox + Precio */}
                <div 
                  className={`w-32 flex items-center justify-center gap-2 ${
                    (canAffordMaintenance(machine) || isMaintenanceChecked) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!canAffordMaintenance(machine) && !isMaintenanceChecked) {
                      alert('Presupuesto insuficiente para este mantenimiento');
                      return;
                    }
                    onActionSelection(machine.id, 'maintenance');
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isMaintenanceChecked}
                    readOnly
                    disabled={!canAffordMaintenance(machine) && !isMaintenanceChecked}
                    className="w-4 h-4 cursor-pointer rounded border-[#333] bg-[#1f1f1f] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-30 disabled:cursor-not-allowed pointer-events-none"
                  />
                  <span className="text-xs text-gray-300">
                    ${maintenanceCost.toLocaleString()}
                  </span>
                </div>
                
                {/* Sustitución - Checkbox + Precio */}
                <div 
                  className={`w-32 flex items-center justify-center gap-2 ${
                    (canAffordReplacement(machine) || isReplacementChecked) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!canAffordReplacement(machine) && !isReplacementChecked) {
                      alert('El costo de sustitución excede el presupuesto total');
                      return;
                    }
                    onActionSelection(machine.id, 'replacement');
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isReplacementChecked}
                    readOnly
                    disabled={!canAffordReplacement(machine) && !isReplacementChecked}
                    className="w-4 h-4 cursor-pointer rounded border-[#333] bg-[#1f1f1f] text-orange-500 focus:ring-orange-500 focus:ring-offset-0 disabled:opacity-30 disabled:cursor-not-allowed pointer-events-none"
                  />
                  <span className="text-xs text-gray-300">
                    ${replacementCost.toLocaleString()}
                  </span>
                </div>
                
                {/* Checkbox Análisis */}
                <div className="w-20 flex justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected(machine.id)}
                    onChange={(e) => handleComparisonCheck(e, machine)}
                    className="w-5 h-5 cursor-pointer rounded border-[#333] bg-[#1f1f1f] text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                    title="Seleccionar para análisis de KPIs"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMachines.length === MAX_SELECTED_MACHINES && (
        <p className="text-xs text-orange-400 mt-2">
          Máximo {MAX_SELECTED_MACHINES} máquinas para comparar
        </p>
      )}
      
      {machines.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No hay máquinas disponibles dentro del presupuesto especificado
        </div>
      )}
    </article>
  );
};

// Función para obtener el color según el uptime
const getUptimeColor = (value) => {
  if (!value) return "text-gray-400";
  // Convertir a escala 0-10 para comparar
  const normalizedValue = value / 10;
  if (normalizedValue >= 7) return "text-green-500";   // 70-100%
  if (normalizedValue >= 5) return "text-yellow-500";  // 50-70%
  return "text-red-500";                                // 0-50%
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

// Componente para celdas de Tipo de Ejercicio
const ExerciseTypeCell = ({ value }) => {
  if (!value) return <p className="text-center text-xs text-gray-400">N/A</p>;
  
  return (
    <p className="text-center text-xs font-medium text-white capitalize">
      {value}
    </p>
  );
};

// Componente para celdas de Uptime
const UptimeCell = ({ value }) => {
  // Convertir el porcentaje (0-100) a escala 0-10
  const normalizedValue = value ? (value / 10).toFixed(1) : null;
  
  return (
    <p className={`text-center text-sm font-bold ${getUptimeColor(value)}`}>
      {normalizedValue || '-'}
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

// Componente para celdas de Recomendación
const RecommendationCell = ({ value }) => {
  if (!value) return <p className="text-center text-sm font-bold text-gray-400">N/A</p>;
  
  const recommendation = value < 100 ? 'MANTENER' : 'SUSTITUIR';
  const color = value < 100 ? 'text-blue-500' : 'text-red-500';
  
  return (
    <p className={`text-center text-xs font-bold ${color}`}>
      {recommendation}
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

// Componente para celdas de Días
const DaysCell = ({ days }) => {
  return (
    <p className="text-center text-sm font-medium text-gray-300">
      {days ? `${days} días` : 'N/A'}
    </p>
  );
};

// Componente para celdas de Índice de Rareza
const RarityIndexCell = ({ value }) => {
  if (!value) return <p className="text-center text-sm font-bold text-gray-400">N/A</p>;
  
  // Color según rareza: 0-5 rojo (común), 5-7 amarillo (poco común), 7-10 verde (raro)
  const getColor = () => {
    if (value >= 7) return 'text-green-500';     // Raro (1-2 máquinas)
    if (value >= 5) return 'text-yellow-500';    // Poco común (3-4 máquinas)
    return 'text-red-500';                       // Común (5+ máquinas)
  };
  
  return (
    <p className={`text-center text-sm font-bold ${getColor()}`}>
      {value.toFixed(2)}
    </p>
  );
};

export default MachineComparisonTable;
