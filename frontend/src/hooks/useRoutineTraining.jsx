import { useState, useEffect, useCallback } from 'react';
import { useUserTraining } from './useUserTraining';

const useRoutineTraining = () => {
  const { training, loading, error, refetch } = useUserTraining();
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!training || !training.days) return;

    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = weekdays[new Date().getDay()];

    setSelectedDay(today);
  }, [training]);

  const hasExercises = useCallback(() => {
    if (!training || !training.days || !selectedDay) return false;

    return Boolean(training.days[selectedDay]?.exercises &&
      training.days[selectedDay].exercises.length > 0);
  }, [training, selectedDay]);

  const hasDayTraining = useCallback((day) => {
    if (!training || !training.days || !training.days[day]) return false;

    return Boolean(training.days[day].exercises &&
      training.days[day].exercises.length > 0);
  }, [training]);

  const getSelectedDayExercises = useCallback(() => {
    if (!hasExercises()) return [];
    return training.days[selectedDay].exercises;
  }, [training, selectedDay, hasExercises]);

  return {
    training,
    loading,
    error,
    refetch,
    selectedDay,
    setSelectedDay,
    hasExercises,
    hasDayTraining,
    getSelectedDayExercises
  };
};

export default useRoutineTraining;