import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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
    const totalHours = calculateTotalOperationalHours(machine.id);
    const uptimePercentage = machine.kpis?.equipmentUptime || 0;
    // Calcular horas reales de uptime basadas en el porcentaje
    const uptimeHours = (totalHours * uptimePercentage) / 100;
    
    return {
      name: machine.model?.name || 'N/A',
      totalHours: totalHours,
      uptimeHours: uptimeHours,
      uptimePercentage: uptimePercentage,
      color: getUptimeColor(uptimePercentage)
    };
  });

  // Encontrar el máximo de horas para escalar el eje Y
  const maxHours = Math.max(...chartData.map(d => d.totalHours));

  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Equipment Uptime</h3>
        <p className="text-xs text-gray-400 mt-1">
          Horas operativas vs horas disponibles (últimos 12 meses)
        </p>
      </div>

      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        {/* Gráfico de barras grises (fondo) */}
        <ResponsiveContainer width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Bar 
              dataKey="totalHours" 
              fill="#2a2a2a" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Gráfico de barras de color (adelante) */}
        <ResponsiveContainer width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              stroke="transparent"
              tick={{ fill: 'transparent' }}
              angle={0}
              textAnchor="middle"
              height={60}
            />
            <YAxis 
              stroke="transparent"
              tick={{ fill: 'transparent' }}
              domain={[0, maxHours * 1.1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [
                  `${entry.uptimeHours.toFixed(0)} h / ${entry.totalHours.toFixed(0)} h (${entry.uptimePercentage.toFixed(1)}%)`,
                  'Uptime'
                ];
              }}
            />
            <Bar 
              dataKey="uptimeHours" 
              radius={[8, 8, 0, 0]}
              label={(props) => {
                const { x, y, width, index } = props;
                const data = chartData[index];
                if (!data) return null;
                
                const percentage = Math.round(data.uptimePercentage);
                return (
                  <text
                    x={x + width / 2}
                    y={y - 5}
                    fill={data.color}
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="14px"
                  >
                    {percentage}%
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Función auxiliar para obtener el color con gradiente continuo según el uptime
const getUptimeColor = (percentage) => {
  // Asegurar que el porcentaje esté entre 0 y 100
  const percent = Math.max(0, Math.min(100, percentage || 0));
  
  if (percent < 30) {
    // Rojo oscuro a rojo (0% - 30%)
    const ratio = percent / 30;
    const r = Math.round(139 + (239 - 139) * ratio); // 139 -> 239
    const g = Math.round(0 + (68 - 0) * ratio);      // 0 -> 68
    const b = Math.round(0 + (68 - 0) * ratio);      // 0 -> 68
    return `rgb(${r}, ${g}, ${b})`;
  } else if (percent < 60) {
    // Rojo a naranja (30% - 60%)
    const ratio = (percent - 30) / 30;
    const r = Math.round(239 + (255 - 239) * ratio); // 239 -> 255
    const g = Math.round(68 + (140 - 68) * ratio);   // 68 -> 140
    const b = Math.round(68 + (0 - 68) * ratio);     // 68 -> 0
    return `rgb(${r}, ${g}, ${b})`;
  } else if (percent < 100) {
    // Naranja a verde (60% - 100%)
    const ratio = (percent - 60) / 40;
    const r = Math.round(255 + (34 - 255) * ratio);  // 255 -> 34
    const g = Math.round(140 + (197 - 140) * ratio); // 140 -> 197
    const b = Math.round(0 + (94 - 0) * ratio);      // 0 -> 94
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Verde brillante al 100%
    return 'rgb(34, 197, 94)'; // #22c55e
  }
};

export default EquipmentUptimeChart;
