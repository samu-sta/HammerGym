import { useMemo } from 'react';
import { KPI_WEIGHTS } from '../constants/kpis';

/**
 * Hook para calcular el score global y procesar datos de entrenadores
 */
export const useTrainerScores = (trainers) => {
  return useMemo(() => {
    if (!trainers || trainers.length === 0) return [];

    return trainers.map(trainer => {
      // Calcular KPIs (pasando todos los trainers para REDD)
      const trce = calculateTRCE(trainer);
      const isac = calculateISAC(trainer);
      const redd = calculateREDD(trainer, trainers);

      // Calcular score global
      const globalScore = 
        trce * KPI_WEIGHTS.TRCE + 
        isac * KPI_WEIGHTS.ISAC + 
        redd * KPI_WEIGHTS.REDD;

      return {
        ...trainer,
        kpis: {
          trce,
          isac,
          redd,
          globalScore: Math.round(globalScore * 100) / 100
        }
      };
    });
  }, [trainers]);
};

// Calcular TRCE (Tasa de Retención de Clientes) - Escala 0-10
const calculateTRCE = (trainer) => {
  const { clientContracts, monthlyEconomy } = trainer;
  
  if (!monthlyEconomy || monthlyEconomy.length === 0) return 0;

  // Usar el último mes como referencia
  const lastMonth = monthlyEconomy[monthlyEconomy.length - 1];
  const firstMonth = monthlyEconomy[0];

  const clientesInicio = firstMonth.activeClients;
  const clientesActivos = lastMonth.activeClients;
  const clientesNuevos = Math.max(0, clientesActivos - clientesInicio);

  if (clientesInicio === 0) return 0;

  const trcePercentage = ((clientesActivos - clientesNuevos) / clientesInicio) * 100;
  const trceClamped = Math.max(0, Math.min(100, trcePercentage));
  
  // Convertir de 0-100 a 0-10
  const trce = trceClamped / 10;
  return Math.round(trce * 100) / 100;
};

// Calcular ISAC (Índice de Satisfacción + Asistencia a Clases) - Escala 0-10
const calculateISAC = (trainer) => {
  const { averageRating, averageAttendance, averageMaxCapacity } = trainer;

  // Normalizar satisfacción (rating 0-5 a porcentaje)
  const satisfaccion = (averageRating / 5) * 100;

  // Calcular porcentaje de asistencia
  const asistencia = averageMaxCapacity > 0 
    ? (averageAttendance / averageMaxCapacity) * 100 
    : 0;

  // ISAC = 60% satisfacción + 40% asistencia (escala 0-100)
  const isacPercentage = (satisfaccion * 0.6) + (asistencia * 0.4);
  
  // Convertir de 0-100 a 0-10
  const isac = isacPercentage / 10;
  return Math.round(isac * 100) / 100;
};

// Calcular REDD (Rendimiento Económico y Desempeño) - Escala 0-10
// REDD = (((IG - CE) / CE) × 0.5 + (CA / CPG) × 0.5) × 100 × 2 (limitado a máximo 100)
// IG: Ingresos generados
// CE: Costo del entrenador
// CA/CPG: Cartera de clientes relativa al total de clientes de todos los entrenadores
const calculateREDD = (trainer, allTrainers) => {
  const { monthlyEconomy } = trainer;

  if (!monthlyEconomy || monthlyEconomy.length === 0) return 0;

  // Usar promedio de los últimos 3 meses
  const recentMonths = monthlyEconomy.slice(-3);
  
  let totalREDD = 0;

  recentMonths.forEach((month, index) => {
    const { income, costs, activeClients } = month;
    
    const ig = income;
    const ce = costs;
    const ca = activeClients;
    
    // Calcular CPG: total de clientes activos de todos los entrenadores en ese mismo mes
    let cpg = 0;
    allTrainers.forEach(t => {
      if (t.monthlyEconomy && t.monthlyEconomy.length > 0) {
        // Obtener el mismo mes relativo (últimos 3 meses)
        const monthIndex = t.monthlyEconomy.length - (recentMonths.length - index);
        if (monthIndex >= 0 && monthIndex < t.monthlyEconomy.length) {
          cpg += t.monthlyEconomy[monthIndex].activeClients || 0;
        }
      }
    });

    // Rentabilidad: ((IG - CE) / CE)
    const rentabilidad = ce > 0 ? ((ig - ce) / ce) : 0;

    // Cartera relativa: (CA / CPG)
    const carteraRelativa = cpg > 0 ? (ca / cpg) : 0;

    // REDD base = (rentabilidad × 0.5 + carteraRelativa × 0.5) × 100
    let reddBase = (rentabilidad * 0.5 + carteraRelativa * 0.5) * 100;
    
    // Multiplicar por 2 para mejor escala visual (0-100)
    let reddPercentage = reddBase * 2;
    
    // Limitar a máximo 100
    reddPercentage = Math.min(100, reddPercentage);
    
    // Convertir de 0-100 a 0-10
    const redd = reddPercentage / 10;
    
    totalREDD += redd;
  });

  const avgREDD = totalREDD / recentMonths.length;
  return Math.round(avgREDD * 100) / 100;
};
