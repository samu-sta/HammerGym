import React, { useEffect, useState } from 'react';
import { fetchEquipmentDatasets } from '../services/MachineService';
import MachineComparisonTable from '../components/MachineDecision/MachineComparisonTable';
import EquipmentUptimeChart from '../components/MachineDecision/EquipmentUptimeChart';
import MaintenanceCostChart from '../components/MachineDecision/MaintenanceCostChart';
import FailureRiskChart from '../components/MachineDecision/FailureRiskChart';

const MachineDecisionPage = () => {
  const [machinesData, setMachinesData] = useState([]);
  const [machineMetrics, setMachineMetrics] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachines, setSelectedMachines] = useState([]);

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
        <p className="text-gray-400">
          Sistema de apoyo a la decisión para mantenimiento y reemplazo de maquinaria
        </p>
      </header>

      {/* Tabla Comparativa */}
      <section id="machine-comparison" className="mb-12 max-w-[1400px] mx-auto">
        <MachineComparisonTable 
          machines={machinesData}
          selectedMachines={selectedMachines}
          onToggleMachine={toggleMachineSelection}
        />
      </section>

      {/* Gráficos Comparativos */}
      {selectedMachines.length > 0 && (
        <section id="machine-comparison-details" className="space-y-10 max-w-[1400px] mx-auto">
          <header>
            <h2 className="text-2xl font-semibold text-white">
              Comparación Detallada de KPIs
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {selectedMachines.length} máquina{selectedMachines.length > 1 ? 's' : ''} seleccionada{selectedMachines.length > 1 ? 's' : ''}
            </p>
          </header>

          {/* KPI 1 y 2: Equipment Uptime + Maintenance Cost (misma fila) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <section className="max-w-[1400px] mx-auto">
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
