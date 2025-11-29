import React, { useEffect, useState } from 'react';
import { fetchEquipmentDatasets } from '../services/MachineService';
import MachineComparisonTable from '../components/MachineDecision/MachineComparisonTable';
import EquipmentUptimeChart from '../components/MachineDecision/EquipmentUptimeChart';
import MaintenanceCostChart from '../components/MachineDecision/MaintenanceCostChart';
import FailureRiskChart from '../components/MachineDecision/FailureRiskChart';
import ExerciseTypeStats from '../components/MachineDecision/ExerciseTypeStats';

const MachineDecisionPage = () => {
  const [machinesData, setMachinesData] = useState([]);
  const [machineMetrics, setMachineMetrics] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [maintenanceBudget, setMaintenanceBudget] = useState('');
  const [selectedForAction, setSelectedForAction] = useState({});

  // Manejar selección múltiple de máquinas (máximo 4)
  const toggleMachineSelection = (machine) => {
    setSelectedMachines(prev => {
      const isSelected = prev.some(m => m.id === machine.id);
      if (isSelected) {
        return prev.filter(m => m.id !== machine.id);
      } else {
        // Limitar a 4 máquinas
        if (prev.length >= 4) {
          alert('Máximo 4 máquinas para comparar');
          return prev;
        }
        return [...prev, machine];
      }
    });
  };

  // Manejar selección de máquinas para mantenimiento/sustitución
  const handleActionSelection = (machineId, action) => {
    setSelectedForAction(prev => {
      const newSelection = { ...prev };
      
      if (!newSelection[machineId]) {
        newSelection[machineId] = { maintenance: false, replacement: false };
      }
      
      // Si la acción ya está seleccionada, deseleccionarla
      if (newSelection[machineId][action]) {
        newSelection[machineId][action] = false;
      } else {
        // Si se selecciona una nueva acción, desactivar la otra
        if (action === 'maintenance') {
          newSelection[machineId].maintenance = true;
          newSelection[machineId].replacement = false;
        } else {
          newSelection[machineId].replacement = true;
          newSelection[machineId].maintenance = false;
        }
      }
      
      // Si ambas están en false, eliminar la entrada
      if (!newSelection[machineId].maintenance && !newSelection[machineId].replacement) {
        delete newSelection[machineId];
      }
      
      return newSelection;
    });
  };

  // Calcular presupuesto restante
  const calculateRemainingBudget = () => {
    const budget = parseFloat(maintenanceBudget) || 0;
    let spent = 0;
    
    Object.keys(selectedForAction).forEach(machineId => {
      const machine = machinesData.find(m => m.id === parseInt(machineId));
      if (!machine) return;
      
      const actions = selectedForAction[machineId];
      if (actions.maintenance) {
        spent += parseFloat(machine.model?.fixedMaintenancePrice || 0);
      }
      if (actions.replacement) {
        spent += parseFloat(machine.replacementValue || 0);
      }
    });
    
    return { budget, spent, remaining: budget - spent };
  };

  // Filtrar máquinas que están dentro del presupuesto (al menos para mantenimiento)
  const getAffordableMachines = () => {
    if (!maintenanceBudget || parseFloat(maintenanceBudget) <= 0) {
      return machinesData;
    }
    
    return machinesData.filter(machine => {
      const maintenanceCost = parseFloat(machine.model?.fixedMaintenancePrice || 0);
      return maintenanceCost <= parseFloat(maintenanceBudget);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMachinesData();
  }, []);

  const fetchMachinesData = async () => {
    try {
      setLoading(true);
      const response = await fetchEquipmentDatasets();
      
      if (response.success) {
        setMachinesData(response.data.machines);
        setMachineMetrics(response.data.machineMetrics);
        setMaintenanceHistory(response.data.maintenanceHistory || []);
      } else {
        setError(response.message || 'Error al cargar los datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
        <section className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando datos de equipamiento...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
        <section className="text-center max-w-md bg-[#1f1f1f] border border-[#333] rounded-lg p-8">
          <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-400 mb-6">❌ {error}</p>
          <button
            onClick={fetchMachinesData}
            className="px-6 py-2 bg-[#1f1f1f] text-white border border-[#333] rounded-lg hover:bg-[#2a2a2a] hover:border-[#444] transition-all"
          >
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8">
      <header className="mb-8 max-w-[1400px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Análisis de Equipamiento y KPIs
        </h1>
        
      </header>

      {/* Tabla Comparativa con Layout de 2 columnas */}
      <section id="machine-comparison" className="mb-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Columna Izquierda: Presupuesto + Máquinas Seleccionadas */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-4 flex flex-col h-full">
              {/* Input de Presupuesto */}
              <div className="flex-shrink-0 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label htmlFor="budget" className="text-sm font-medium text-white whitespace-nowrap">
                      Presupuesto
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm">$</span>
                      <input
                        id="budget"
                        type="number"
                        min="0"
                        step="100"
                        value={maintenanceBudget}
                        onChange={(e) => setMaintenanceBudget(e.target.value)}
                        placeholder="0"
                        className="w-24 px-2 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {maintenanceBudget && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Restante:</span>
                      <span className={`text-lg font-bold ${
                        calculateRemainingBudget().remaining >= 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        ${calculateRemainingBudget().remaining.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-[#333] mb-2 flex-shrink-0"></div>

              {/* Máquinas Seleccionadas */}
              <div className="flex-1 min-h-0 flex flex-col">
                
                {Object.keys(selectedForAction).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm flex-shrink-0">
                    Selecciona máquinas para<br />mantenimiento o sustitución
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 mb-2 overflow-y-auto flex-1 min-h-0">
                      {Object.keys(selectedForAction).map(machineId => {
                        const machine = machinesData.find(m => m.id === parseInt(machineId));
                        if (!machine) return null;
                        
                        const actions = selectedForAction[machineId];
                        const maintenanceCost = parseFloat(machine.model?.fixedMaintenancePrice || 0);
                        const replacementCost = parseFloat(machine.replacementValue || 0);
                        const cost = actions.maintenance ? maintenanceCost : replacementCost;
                        const isMaintenance = actions.maintenance;
                        
                        return (
                          <div key={machineId} className={`border rounded-lg p-2 flex-shrink-0 flex items-center justify-between ${
                            isMaintenance 
                              ? 'bg-blue-500/10 border-blue-500/30' 
                              : 'bg-orange-500/10 border-orange-500/30'
                          }`}>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">
                                {machine.model?.name}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {machine.model?.brand}
                              </p>
                            </div>
                            <span className={`text-sm font-bold ml-2 ${
                              isMaintenance ? 'text-blue-400' : 'text-orange-400'
                            }`}>
                              ${cost.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Selección de Máquinas (Derecha - Altura completa) */}
          <div className="lg:col-span-3">
            <MachineComparisonTable 
              machines={getAffordableMachines()}
              selectedMachines={selectedMachines}
              onToggleMachine={toggleMachineSelection}
              selectedForAction={selectedForAction}
              onActionSelection={handleActionSelection}
              maintenanceBudget={parseFloat(maintenanceBudget) || 0}
              remainingBudget={calculateRemainingBudget().remaining}
            />
          </div>
        </div>
      </section>

      {/* Gráficos Comparativos */}
      {selectedMachines.length > 0 && (
        <section id="machine-comparison-details" className="space-y-10 max-w-[1800px] mx-auto">
          <header>
            <h2 className="text-2xl font-semibold text-white">
              Comparación Detallada de KPIs
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {selectedMachines.length} máquina{selectedMachines.length > 1 ? 's' : ''} seleccionada{selectedMachines.length > 1 ? 's' : ''}
            </p>
          </header>

          {/* KPI 1 y 2: Equipment Uptime + Maintenance Cost (misma fila) */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_1fr] gap-6">
            <ExerciseTypeStats machines={machinesData} />
            <EquipmentUptimeChart machines={selectedMachines} machineMetrics={machineMetrics} />
            <MaintenanceCostChart machines={selectedMachines} />
          </div>

          {/* KPI 3: Failure Risk */}
          <FailureRiskChart 
            machines={selectedMachines} 
            machineMetrics={machineMetrics}
            maintenanceHistory={maintenanceHistory}
          />
        </section>
      )}

      {selectedMachines.length === 0 && (
        <section className="max-w-[1800px] mx-auto">
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">
              Selecciona hasta 4 máquinas de la tabla para comparar sus KPIs
            </p>
            <p className="text-gray-500 text-sm">
              Los gráficos comparativos aparecerán aquí
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default MachineDecisionPage;
