import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CHART_COLORS } from '../../constants/colors';
import { KPI_TARGETS } from '../../constants/kpis';

const TRAINER_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const MONTH_OPTIONS = [
  { value: 1, label: 'Último mes' },
  { value: 2, label: 'Últimos 2 meses' },
  { value: 3, label: 'Últimos 3 meses' },
  { value: 4, label: 'Últimos 4 meses' },
  { value: 5, label: 'Últimos 5 meses' },
  { value: 6, label: 'Últimos 6 meses' },
];

const TRCEBreakdown = ({ trainers }) => {
  // Limitar a 3 entrenadores
  const selectedTrainers = trainers.slice(0, 3);
  const [monthsToShow, setMonthsToShow] = useState(6);

  // Datos para los gauges - usar retención real en lugar de TRCE
  const gaugeData = useMemo(() => {
    return selectedTrainers.map((trainer, idx) => {
      const retencionReal = trainer.retencionReal || 0; // Porcentaje 0-100
      const remaining = 100 - retencionReal;
      
      return {
        trainer: trainer.username,
        value: retencionReal,
        data: [
          { name: 'Retención', value: retencionReal, fill: TRAINER_COLORS[idx] },
          { name: 'Restante', value: remaining, fill: '#e5e7eb' }
        ],
        color: TRAINER_COLORS[idx],
        targetMet: retencionReal >= 80 // Meta de 80% de retención
      };
    });
  }, [selectedTrainers]);

  // Datos para el grouped bar chart con filtro de meses
  const clientEvolutionData = useMemo(() => {
    const metrics = ['Clientes Inicio', 'Nuevos Clientes', 'Clientes Final'];
    
    return metrics.map(metric => {
      const dataPoint = { metric };
      
      selectedTrainers.forEach((trainer, idx) => {
        const monthlyEconomy = trainer.monthlyEconomy || [];
        if (monthlyEconomy.length === 0) {
          dataPoint[trainer.username] = 0;
          return;
        }

        // Filtrar por los últimos X meses
        const filteredMonths = monthlyEconomy.slice(-monthsToShow);
        const firstMonth = filteredMonths[0];
        const lastMonth = filteredMonths[filteredMonths.length - 1];
        
        const clientesInicio = firstMonth.activeClients;
        const clientesFinal = lastMonth.activeClients;
        
        // Sumar nuevos clientes de los meses filtrados (desde el backend)
        const nuevosClientes = filteredMonths.reduce((sum, month) => sum + (month.nuevosClientes || 0), 0);

        if (metric === 'Clientes Inicio') {
          dataPoint[trainer.username] = clientesInicio;
        } else if (metric === 'Nuevos Clientes') {
          dataPoint[trainer.username] = nuevosClientes;
        } else {
          dataPoint[trainer.username] = clientesFinal;
        }
      });

      return dataPoint;
    });
  }, [selectedTrainers, monthsToShow]);

  return (
    <section id="trce-comparison" className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white mb-2">
          TRCE - Tasa de Retención de Clientes
        </h3>
        <select 
          value={monthsToShow} 
          onChange={(e) => setMonthsToShow(Number(e.target.value))}
          className="px-3 py-1.5 text-xs bg-[#1f1f1f] border border-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MONTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </header>

      {/* Multi-Gauge Chart con métricas */}
      <section id="trce-gauges" className="flex gap-6">
        {/* Labels a la izquierda */}
        <div className="flex flex-col justify-end pb-4 space-y-2 text-sm min-w-fit">
          <div className="h-[150px]"></div> {/* Espacio para el gauge */}
          <div className="h-[60px]"></div> {/* Espacio para el porcentaje */}
          <div className="h-8 flex items-center">
            <span className="text-gray-400">Nuevos Clientes:</span>
          </div>
          <div className="h-8 flex items-center">
            <span className="text-gray-400">Clientes Perdidos:</span>
          </div>
          <div className="h-8 flex items-center pt-2 border-t border-[#333]">
            <span className="text-white font-semibold">Total Actual:</span>
          </div>
        </div>

        {/* Gauges y valores */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedTrainers.map((trainer, idx) => {
            const monthlyEconomy = trainer.monthlyEconomy || [];
            // Filtrar por los últimos X meses
            const filteredMonths = monthlyEconomy.slice(-monthsToShow);
            const firstMonth = filteredMonths.length > 0 ? filteredMonths[0] : { activeClients: 0 };
            const lastMonth = filteredMonths.length > 0 ? filteredMonths[filteredMonths.length - 1] : { activeClients: 0 };
            
            const clientesInicio = firstMonth.activeClients;
            const clientesFinal = lastMonth.activeClients;
            
            // Sumar nuevos clientes y perdidos de los meses filtrados (datos reales del backend)
            const nuevosClientes = filteredMonths.reduce((sum, month) => sum + (month.nuevosClientes || 0), 0);
            const perdidos = filteredMonths.reduce((sum, month) => sum + (month.clientesPerdidos || 0), 0);

            return (
              <figure key={idx} className="flex flex-col items-center">
                <figcaption className="text-sm font-semibold text-white mb-2">
                  {trainer.username}
                </figcaption>
                
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={gaugeData[idx].data}
                      cx="50%"
                      cy="70%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {gaugeData[idx].data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="text-center -mt-8 relative z-10 mb-4">
                  <p className="text-3xl font-bold" style={{ color: TRAINER_COLORS[idx] }}>
                    {trainer.retencionReal?.toFixed(1) || '0.0'}%
                  </p>
                  <p className="text-xs text-gray-400">
                    Retención Real
                  </p>
                </div>

                {/* Solo los valores numéricos */}
                <div className="w-full space-y-2 text-sm">
                  <div className="h-8 flex items-center justify-center">
                    <span className="font-bold text-green-500 text-base">+{nuevosClientes}</span>
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    <span className="font-bold text-red-500 text-base">-{perdidos}</span>
                  </div>
                  <div className="h-8 flex items-center justify-center pt-2 border-t border-[#333]">
                    <span className="font-bold text-white text-lg">{clientesFinal}</span>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default TRCEBreakdown;
