import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EquipmentUptimeChart = ({ machines, machineMetrics }) => {
  if (!machines || machines.length === 0) {
    return (
      <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Equipment Uptime (%)</h3>
        <p className="text-gray-400 text-center py-8">Selecciona máquinas para comparar</p>
      </div>
    );
  }

  // Calcular total operational hours de los últimos 12 meses para cada máquina
  const calculateTotalOperationalHours = (machineId) => {
    if (!machineMetrics) return 0;
    
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    return machineMetrics
      .filter(metric => {
        if (metric.machineId !== machineId) return false;
        const metricDate = new Date(metric.month);
        return metricDate >= twelveMonthsAgo;
      })
      .reduce((sum, metric) => sum + parseInt(metric.totalOperationalHours || 0), 0);
  };

  // Preparar datos para el gráfico
  const chartData = machines.map(machine => {
    const usedHours = calculateTotalOperationalHours(machine.id);
    const uptimePercentage = machine.kpis?.equipmentUptime || 0;
    // Calcular horas disponibles basadas en el porcentaje de uptime
    // Si uptime es 80%, entonces usedHours representa el 80% del total disponible
    const availableHours = uptimePercentage > 0 ? (usedHours / uptimePercentage) * 100 : usedHours * 1.2;
    
    return {
      name: machine.model?.name || 'N/A',
      horasUsadas: Math.round(usedHours),
      horasDisponibles: Math.round(availableHours),
      uptimePercentage: uptimePercentage
    };
  });

  // Encontrar el máximo de horas para escalar el eje Y
  const maxHours = Math.max(...chartData.map(d => Math.max(d.horasUsadas, d.horasDisponibles)));

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Utilización</h3>
        <p className="text-xs text-gray-400 mt-1">
          Horas usadas vs horas disponibles por máquina (últimos 12 meses)
        </p>
      </div>

      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="name" 
              stroke="#888"
              tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 'bold' }}
              angle={0}
              textAnchor="middle"
              height={60}
            />
            <YAxis 
              stroke="#888"
              tick={{ fill: '#888' }}
              domain={[0, maxHours * 1.1]}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: '#888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                return [
                  `${value.toLocaleString('es-ES')} horas`,
                  name === 'horasUsadas' ? 'Horas Usadas' : 'Horas Disponibles'
                ];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '5px' }}
              iconType="rect"
              formatter={(value) => {
                return value === 'horasUsadas' ? 'Horas Usadas' : 'Horas Disponibles';
              }}
            />
            <Bar 
              dataKey="horasUsadas" 
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
              name="horasUsadas"
              label={{
                position: 'top',
                fill: '#22c55e',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: (value) => `${value.toLocaleString('es-ES')}h`
              }}
            />
            <Bar 
              dataKey="horasDisponibles" 
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="horasDisponibles"
              label={{
                position: 'top',
                fill: '#3b82f6',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: (value) => `${value.toLocaleString('es-ES')}h`
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentUptimeChart;
