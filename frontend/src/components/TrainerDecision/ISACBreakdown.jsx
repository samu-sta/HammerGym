import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { CHART_COLORS } from '../../constants/colors';
import { KPI_TARGETS } from '../../constants/kpis';

const TRAINER_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const ISACBreakdown = ({ trainers }) => {
  // Limitar a 3 entrenadores
  const selectedTrainers = trainers.slice(0, 3);

  // Datos para Dual-Bar Comparativo (Grouped Horizontal Bars)
  const dualBarData = useMemo(() => {
    return selectedTrainers.map((trainer, idx) => {
      const satisfaccion = (trainer.averageRating / 5) * 100;
      const asistencia = trainer.averageMaxCapacity > 0 
        ? (trainer.averageAttendance / trainer.averageMaxCapacity) * 100 
        : 0;

      return {
        name: trainer.username,
        Satisfacción: Math.round(satisfaccion * 100) / 100,
        Asistencia: Math.round(asistencia * 100) / 100,
        ISAC: trainer.kpis.isac,
        color: TRAINER_COLORS[idx]
      };
    });
  }, [selectedTrainers]);

  // Datos para Scatter Plot Multi-Series
  const scatterDataSeries = useMemo(() => {
    return selectedTrainers.map((trainer, idx) => {
      const satisfaccion = (trainer.averageRating / 5) * 100;
      const asistencia = trainer.averageMaxCapacity > 0 
        ? (trainer.averageAttendance / trainer.averageMaxCapacity) * 100 
        : 0;

      return {
        name: trainer.username,
        data: [{
          x: asistencia,
          y: satisfaccion,
          z: trainer.totalClasses || 10,
          trainer: trainer.username
        }],
        fill: TRAINER_COLORS[idx]
      };
    });
  }, [selectedTrainers]);

  // Determinar cuadrante para cada entrenador
  const getQuadrant = (asistencia, satisfaccion) => {
    const midAsistencia = 50;
    const midSatisfaccion = 60;

    if (asistencia >= midAsistencia && satisfaccion >= midSatisfaccion) {
      return { label: '🟢 Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (asistencia >= midAsistencia && satisfaccion < midSatisfaccion) {
      return { label: '🟡 Revisar calidad', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    } else if (asistencia < midAsistencia && satisfaccion >= midSatisfaccion) {
      return { label: '🟡 Problema de horarios', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    } else {
      return { label: '🔴 Crítico', color: 'text-red-600', bg: 'bg-red-50' };
    }
  };

  return (
    <section id="isac-comparison" className="bg-[#1f1f1f] border border-[#333] rounded-lg shadow-md p-6 space-y-8">
      <header>
        <h3 className="text-xl font-semibold text-white mb-2">
          ISAC - Índice de Satisfacción + Asistencia
        </h3>
      </header>

      {/* Leyenda personalizada arriba */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {selectedTrainers.map((trainer, idx) => {
          const satisfaccion = (trainer.averageRating / 5) * 100;
          const asistencia = trainer.averageMaxCapacity > 0 
            ? (trainer.averageAttendance / trainer.averageMaxCapacity) * 100 
            : 0;
          
          return (
            <div key={idx} className="flex items-center gap-3 bg-[#2a2a2a] p-2 px-4 rounded-full">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: TRAINER_COLORS[idx] }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{trainer.username}</span>
                <div className="flex gap-3 text-xs">
                  <span className={asistencia >= 50 ? 'text-green-500' : 'text-red-500'}>
                    Asist: {asistencia.toFixed(1)}%
                  </span>
                  <span className={satisfaccion >= 50 ? 'text-green-500' : 'text-red-500'}>
                    Satisf: {satisfaccion.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scatter Plot Multi-Series */}
      <figure>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Asistencia"
              domain={[0, 100]}
              label={{ value: 'Asistencia (%)', position: 'bottom', offset: 0 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Satisfacción"
              domain={[0, 100]}
              label={{ value: 'Satisfacción (%)', angle: -90, position: 'center' }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 500]} />
            
            {/* Líneas de referencia continuas en el 50% de cada eje */}
            <ReferenceLine x={50} stroke="#6b7280" strokeWidth={2} />
            <ReferenceLine y={50} stroke="#6b7280" strokeWidth={2} />
            
            {scatterDataSeries.map((series, idx) => (
              <Scatter
                key={idx}
                name={series.name}
                data={series.data}
                fill={series.fill}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </figure>
    </section>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.trainer}</p>
        <p className="text-sm text-gray-600">Asistencia: {data.x.toFixed(1)}%</p>
        <p className="text-sm text-gray-600">Satisfacción: {data.y.toFixed(1)}%</p>
        <p className="text-sm text-gray-600">Clases: {data.z}</p>
      </div>
    );
  }
  return null;
};

export default ISACBreakdown;
