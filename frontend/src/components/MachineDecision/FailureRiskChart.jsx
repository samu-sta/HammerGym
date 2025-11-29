import React from 'react';

const FailureRiskChart = ({ machines, machineMetrics, maintenanceHistory }) => {
  if (!machines || machines.length === 0) {
    return (
      <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Riesgo de Fallo (Predicción IA)
        </h3>
        <p className="text-gray-400 text-center py-8">Selecciona máquinas para comparar</p>
      </div>
    );
  }

  // Calcular métricas para cada máquina
  const calculateMachineMetrics = (machine) => {
    const now = new Date();
    const purchaseDate = new Date(machine.purchaseDate);
    const ageYears = ((now - purchaseDate) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
    const ageMonths = Math.floor((now - purchaseDate) / (30.44 * 24 * 60 * 60 * 1000));

    // Obtener métricas del último mes
    const latestMetrics = machineMetrics
      ?.filter(m => m.machineId === machine.id)
      .sort((a, b) => new Date(b.month) - new Date(a.month))[0];

    // Calcular horas de uso últimos 30 días (diferencia entre último mes y mes anterior)
    const sortedMetrics = machineMetrics
      ?.filter(m => m.machineId === machine.id)
      .sort((a, b) => new Date(b.month) - new Date(a.month));
    
    const hoursLast30d = sortedMetrics && sortedMetrics.length >= 2
      ? (sortedMetrics[0].totalOperationalHours - sortedMetrics[1].totalOperationalHours)
      : (sortedMetrics?.[0]?.totalOperationalHours || 0);

    // Obtener datos de mantenimiento de esta máquina desde el array global
    const machineMaintenanceHistory = maintenanceHistory?.filter(m => m.machineId === machine.id) || [];
    
    const correctiveMaintenances = machineMaintenanceHistory
      .filter(m => m.maintenanceType === 'Corrective')
      .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)); // Ordenar por fecha más reciente
    
    // Tiempo desde último fallo (desde el mantenimiento correctivo más reciente)
    let daysSinceLastFailure = null; // null = infinito (nunca ha fallado)
    if (correctiveMaintenances.length > 0) {
      const lastFailureDate = new Date(correctiveMaintenances[0].dateCompleted);
      daysSinceLastFailure = Math.floor((now - lastFailureDate) / (24 * 60 * 60 * 1000));
    }

    // Número de fallos últimos 12 meses
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const failuresLast12m = correctiveMaintenances.filter(
      m => new Date(m.dateCompleted) >= twelveMonthsAgo
    ).length;

    // Costo acumulado 12 meses (preventivos + correctivos)
    const costLast12m = machineMaintenanceHistory
      .filter(m => new Date(m.dateCompleted) >= twelveMonthsAgo)
      .reduce((sum, m) => sum + parseFloat(m.repairCost || 0), 0);

    // Tiempo inactividad 12 meses (suma de downtime_days)
    const downtimeLast12m = machineMaintenanceHistory
      .filter(m => new Date(m.dateCompleted) >= twelveMonthsAgo)
      .reduce((sum, m) => {
        const reported = new Date(m.dateReported);
        const completed = new Date(m.dateCompleted);
        return sum + ((completed - reported) / (24 * 60 * 60 * 1000));
      }, 0);

    return {
      id: machine.id,
      equipmentId: `${machine.id}`, // ID original
      name: machine.model?.name || 'N/A',
      manufacturer: machine.model?.brand || 'N/A',
      equipmentType: machine.model?.type || 'N/A',
      month: latestMetrics?.month ? new Date(latestMetrics.month).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'N/A',
      ageYears,
      ageMonths,
      totalOperationalHours: latestMetrics?.totalOperationalHours || 0,
      hoursLast30d: hoursLast30d.toFixed(0),
      totalSessions: latestMetrics?.totalSessions || 0,
      avgDailyPeakUsage: latestMetrics?.avgDailyPeakUsage || 0,
      daysSinceLastFailure,
      failuresLast12m,
      vibration: latestMetrics?.vibrationLevel ? parseFloat(latestMetrics.vibrationLevel).toFixed(2) : '0.00',
      temperature: latestMetrics?.temperatureDeviation ? parseFloat(latestMetrics.temperatureDeviation).toFixed(2) : '0.00',
      powerConsumption: latestMetrics?.powerConsumption || 0,
      costLast12m: costLast12m.toFixed(0),
      downtimeLast12m: downtimeLast12m.toFixed(0),
      diasHastaFallo: machine.kpis?.diasDespuesDeFallo || 15
    };
  };

  const tableData = machines.map(calculateMachineMetrics);

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Riesgo de Fallo en 30 Días (Predicción IA)
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Variables operacionales últimos 12 meses y predicción de fallo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla transpuesta */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left py-3 px-3 font-semibold text-gray-300 text-xs sticky left-0 bg-[#1f1f1f]">Máquina</th>
                {tableData.map((machine) => (
                  <th key={machine.id} className="text-center py-3 px-3 font-semibold text-white text-xs">
                    {machine.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                <td className="py-3 px-3 text-white font-bold text-xs sticky left-0 bg-blue-500/20">Días hasta fallo</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center">
                    <span className={`font-bold text-base ${getDaysColor(row.diasHastaFallo)}`}>
                      {row.diasHastaFallo}
                    </span>
                  </td>
                ))}
              </tr>
              {/* Ordenado por importancia SHAP (de mayor a menor) */}
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Días s/fallo</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300">
                    {row.daysSinceLastFailure !== null ? (
                      <span className="text-xs">{row.daysSinceLastFailure}</span>
                    ) : (
                      <span className="text-lg">∞</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Fallos últimos 12m</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.failuresLast12m}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Horas totales</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.totalOperationalHours}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Tipo de equipo</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs capitalize">{row.equipmentType}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">ID Equipo</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.equipmentId}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Edad (meses)</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.ageMonths}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Sesiones totales</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.totalSessions}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Consumo energía</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.powerConsumption}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Nivel vibración</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.vibration}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Desviación temp.</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.temperature}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Uso pico diario</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.avgDailyPeakUsage}</td>
                ))}
              </tr>
              <tr className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
                <td className="py-3 px-3 text-gray-300 font-medium text-xs sticky left-0 bg-[#1f1f1f]">Marca</td>
                {tableData.map((row) => (
                  <td key={row.id} className="py-3 px-3 text-center text-gray-300 text-xs">{row.manufacturer}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gráfico SHAP - Importancia de variables */}
        <div className="bg-[#2a2a2a] rounded-lg p-4 flex items-center justify-center">
          <img 
            src="/images/SHAP.png" 
            alt="SHAP Values - Importancia de variables en predicción de fallos"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para colorear días hasta fallo
const getDaysColor = (days) => {
  if (days > 20) return 'text-green-500';
  if (days > 10) return 'text-yellow-500';
  return 'text-red-500';
};

export default FailureRiskChart;
