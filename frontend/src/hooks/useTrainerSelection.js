import { useState, useCallback } from 'react';

/**
 * Hook para manejar la selección de entrenador
 */
export const useTrainerSelection = (trainers) => {
  const [selectedTrainer, setSelectedTrainer] = useState(
    trainers && trainers.length > 0 ? trainers[0] : null
  );

  const selectTrainer = useCallback((trainer) => {
    setSelectedTrainer(trainer);
  }, []);

  const selectTrainerById = useCallback((id) => {
    const trainer = trainers?.find(t => t.id === id);
    if (trainer) {
      setSelectedTrainer(trainer);
    }
  }, [trainers]);

  return {
    selectedTrainer,
    selectTrainer,
    selectTrainerById
  };
};
