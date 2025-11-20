import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { KPI_TARGETS } from '../../constants/kpis';

const TRAINER_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const MONTH_OPTIONS = [
  { value: 2, label: 'Últimos 2 meses' },
  { value: 3, label: 'Últimos 3 meses' },
  { value: 4, label: 'Últimos 4 meses' },
  { value: 5, label: 'Últimos 5 meses' },
  { value: 6, label: 'Últimos 6 meses' },
];

const REDDBreakdown = ({ trainers, allTrainers }) => {
  // Limitar a 3 entrenadores para comparación
  const selectedTrainers = trainers.slice(0, 3);
  const [monthsToShow, setMonthsToShow] = useState(6);

  // Calcular el total de clientes de TODOS los entrenadores del gimnasio
  const totalAllClients = useMemo(() => {
    // Usar allTrainers (todos los del gimnasio) en lugar de trainers (solo seleccionados)
    return allTrainers.reduce((sum, trainer) => {
      const lastEconomy = trainer.monthlyEconomy && trainer.monthlyEconomy.length > 0 
        ? trainer.monthlyEconomy[trainer.monthlyEconomy.length - 1]
        : { activeClients: 0 };
      return sum + (lastEconomy.activeClients || 0);
    }, 0);
  }, [allTrainers]);

  // Datos comparativos para gráfica agrupada
  const comparisonData = useMemo(() => {
    return selectedTrainers.map((trainer, idx) => {
      const lastEconomy = trainer.monthlyEconomy && trainer.monthlyEconomy.length > 0 
        ? trainer.monthlyEconomy[trainer.monthlyEconomy.length - 1]
        : { income: 0, costs: 0, activeClients: 0, potentialClients: 0 };

      const costes = lastEconomy.costs || 0;
      const ingresos = lastEconomy.income || 0;
      const beneficio = ingresos - costes;
      const rentabilidad = costes > 0 ? ((ingresos - costes) / costes) * 100 : 0;
      const fidelizacion = lastEconomy.potentialClients > 0 
        ? (lastEconomy.activeClients / lastEconomy.potentialClients) * 100 
        : 0;
      
      // Normalizar beneficio a escala 0-100 para visualización
      const maxBeneficio = Math.max(...selectedTrainers.map(t => {
        const e = t.monthlyEconomy?.[t.monthlyEconomy.length - 1];
        return e ? (e.income - e.costs) : 0;
      }));
      const beneficioNormalizado = maxBeneficio > 0 ? (beneficio / maxBeneficio) * 100 : 0;

      return {
        trainer: trainer.username,
        color: TRAINER_COLORS[idx],
        costes,
        ingresos,
        beneficio,
        beneficioNormalizado,
        rentabilidad,
        fidelizacion,
        redd: trainer.kpis.redd,
        activeClients: lastEconomy.activeClients,
        potentialClients: lastEconomy.potentialClients
      };
    });
  }, [selectedTrainers]);

  // Calcular la media de beneficios de TODOS los entrenadores
  const averageBenefit = useMemo(() => {
    if (!allTrainers || allTrainers.length === 0) return 0;
    
    const totalBenefit = allTrainers.reduce((sum, trainer) => {
      const lastEconomy = trainer.monthlyEconomy && trainer.monthlyEconomy.length > 0 
        ? trainer.monthlyEconomy[trainer.monthlyEconomy.length - 1]
        : { income: 0, costs: 0 };
      const benefit = (lastEconomy.income || 0) - (lastEconomy.costs || 0);
      return sum + benefit;
    }, 0);
    
    return totalBenefit / allTrainers.length;
  }, [allTrainers]);

  // Datos para gráfico de dispersión Ingresos vs Gastos
  const scatterChartData = useMemo(() => {
    return selectedTrainers.map((trainer, idx) => {
      const lastEconomy = trainer.monthlyEconomy && trainer.monthlyEconomy.length > 0 
        ? trainer.monthlyEconomy[trainer.monthlyEconomy.length - 1]
        : { income: 0, costs: 0 };

      return {
        name: trainer.username,
        costs: lastEconomy.costs || 0,
        income: lastEconomy.income || 0,
        color: TRAINER_COLORS[idx],
        benefit: (lastEconomy.income || 0) - (lastEconomy.costs || 0)
      };
    });
  }, [selectedTrainers]);

  // Datos para la línea de referencia (y = x + beneficioMedio)
  const referenceLineData = useMemo(() => {
    if (scatterChartData.length === 0) return [];
    
    const maxCost = Math.max(...scatterChartData.map(d => d.costs), 0);
    const minCost = Math.min(...scatterChartData.map(d => d.costs), 0);
    
    // Extender un poco la línea para que se vea completa
    const startX = Math.max(0, minCost - 500);
    const endX = maxCost + 500;
    
    return [
      { costs: startX, income: startX + averageBenefit },
      { costs: endX, income: endX + averageBenefit }
    ];
  }, [scatterChartData, averageBenefit]);

  // Calcular el dominio común para mantener proporción 1:1
  const axisDomain = useMemo(() => {
    // Dominio fijo de 0 a 4000 para mantener escala 1:1
    return { min: 0, max: 4000 };
  }, []);

  // Datos para el gráfico de tarta de distribución de clientes
  const pieChartData = useMemo(() => {
    const selectedClientsTotal = comparisonData.reduce((sum, t) => sum + t.activeClients, 0);
    const remainingClients = totalAllClients - selectedClientsTotal;
    
    // Datos de los entrenadores seleccionados
    const trainersData = comparisonData.map((trainer, idx) => ({
      name: trainer.trainer,
      value: trainer.activeClients, // Usar número real de clientes
      actualClients: trainer.activeClients,
      percentage: totalAllClients > 0 ? ((trainer.activeClients / totalAllClients) * 100).toFixed(1) : '0.0',
      color: TRAINER_COLORS[idx],
      isOthers: false
    }));
    
    // SIEMPRE agregar la sección "Otros entrenadores" (incluso si es 0)
    trainersData.push({
      name: 'Otros entrenadores',
      value: Math.max(0, remainingClients), // Asegurar que no sea negativo
      actualClients: Math.max(0, remainingClients),
      percentage: totalAllClients > 0 ? ((Math.max(0, remainingClients) / totalAllClients) * 100).toFixed(1) : '0.0',
      color: '#6b7280', // Color gris visible
      isOthers: true
    });
    
    return trainersData;
  }, [comparisonData, totalAllClients]);

  return (
    <section id="redd-comparison" className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-6 space-y-8">
      <header>
        <h3 className="text-xl font-semibold text-white mb-2">
          REDD - Rendimiento Económico y Clientes
        </h3>
      </header>

      {/* Grid con ambos gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de dispersión Ingresos vs Gastos */}
        <figure>
          <header className="mb-4 text-center">
            <h4 className="text-base font-semibold text-white">Análisis de Rentabilidad</h4>
          </header>

          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                type="number"
                dataKey="costs"
                domain={[axisDomain.min, axisDomain.max]}
                ticks={[0, 1000, 2000, 3000, 4000]}
                stroke="#888"
                style={{ fontSize: "12px" }}
                label={{ 
                  value: 'Gastos ($)', 
                  position: 'bottom', 
                  offset: 10,
                  style: { fontSize: '12px', fill: '#888' } 
                }}
              />
              <YAxis 
                type="number"
                dataKey="income"
                domain={[axisDomain.min, axisDomain.max]}
                ticks={[0, 1000, 2000, 3000, 4000]}
                stroke="#888"
                style={{ fontSize: "12px" }}
                label={{ 
                  value: 'Ingresos ($)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10,
                  style: { fontSize: '12px', fill: '#888' } 
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value, name) => {
                  if (name === 'costs') return [`$${value}`, 'Gastos'];
                  if (name === 'income') return [`$${value}`, 'Ingresos'];
                  return [value, name];
                }}
                labelFormatter={(value, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return `${data.name} - Beneficio: $${data.benefit.toFixed(0)}`;
                  }
                  return '';
                }}
              />

              {/* Línea de referencia con pendiente 1: y = x + beneficioMedio */}
              <Line
                data={referenceLineData}
                type="linear"
                dataKey="income"
                stroke="#fbbf24"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                legendType="none"
              />

              {selectedTrainers.map((trainer, idx) => {
                const trainerData = scatterChartData[idx];
                return (
                  <Scatter
                    key={idx}
                    name={trainer.username}
                    data={[trainerData]}
                    fill={TRAINER_COLORS[idx]}
                    shape="circle"
                    r={8}
                  />
                );
              })}
            </ScatterChart>
          </ResponsiveContainer>
        </figure>

        {/* Gráfico de tarta - Distribución de clientes */}
        <figure>
          <header className="mb-4 text-center">
            <h4 className="text-base font-semibold text-white">Distribución de Clientes</h4>
          </header>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={450}
                  labelLine={false}
                  label={(entry) => {
                    // Usar el percentage que calculé manualmente
                    return `${entry.name}: ${entry.percentage}%`;
                  }}
                  outerRadius={120}
                  dataKey="value"
                  stroke="#333"
                  strokeWidth={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name, props) => [
                    `${props.payload.actualClients} clientes (${props.payload.percentage}% del total)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default REDDBreakdown;
