import { useMemo } from 'react';

/**
 * Hook para calcular la variación (delta) entre un valor y su objetivo
 */
export const useDelta = (current, target) => {
  return useMemo(() => {
    if (target === 0) return 0;
    const delta = ((current - target) / target) * 100;
    return Math.round(delta * 100) / 100;
  }, [current, target]);
};
