import { useMemo } from 'react';

/**
 * Hook para procesar datos de entrenadores
 * Los KPIs ahora se calculan en el backend y vienen en la respuesta
 */
export const useTrainerScores = (trainers) => {
  return useMemo(() => {
    if (!trainers || trainers.length === 0) return [];

    // Los trainers ya vienen con los KPIs calculados desde el backend
    // Solo retornamos los datos tal como vienen
    return trainers.map(trainer => ({
      ...trainer,
      // Asegurar que kpis existe (por compatibilidad)
      kpis: trainer.kpis || {
        trce: 0,
        isac: 0,
        redd: 0,
        globalScore: 0
      }
    }));
  }, [trainers]);
};
