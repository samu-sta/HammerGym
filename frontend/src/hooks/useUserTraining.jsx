import { useState, useEffect, useCallback } from 'react';
import { getUserTraining } from '../services/UserService';

export const useUserTraining = () => {
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchTraining = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserTraining();

      if (response.success) {
        setTraining(response.training);
      } else {
        setError(response.message || 'Error al obtener el entrenamiento');
      }
    } catch (err) {
      setError('No se pudo cargar tu rutina de entrenamiento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  return {
    training,
    loading,
    error,
    selectedDay,
    setSelectedDay,
    refetch: fetchTraining
  };
};