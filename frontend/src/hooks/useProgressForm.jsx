import { useState, useCallback } from 'react';
import { createProgressUser } from '../services/ProgressUserService';
import { validateCreateProgressUser } from '../schemas/progress';
import { dayNumberMap } from '../config/constants';

const useProgressForm = (selectedDay, trainingId, onClose) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    const progress = {
      howWasIt: difficulty,
      observations
    };
    const result = validateCreateProgressUser(progress);
    if (!result.success) {
      setFormMessage(result.error);
      setIsSubmitting(false);
      return;
    }

    const today = new Date();
    const currentDayoFWeek = today.getDay();
    const selectedDayNumber = dayNumberMap[selectedDay];

    const difference = (selectedDayNumber - currentDayoFWeek) % 7;
    const selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() + difference);

    progress.date = selectedDate.toISOString().split('T')[0];
    progress.trainingId = trainingId;

    try {
      const response = await createProgressUser(progress);
      if (!response.success) {
        setFormMessage(response.message);
        return;
      }
      setFormMessage('Progreso guardado correctamente');
      onClose();
    }
    catch (error) {
      setFormMessage('Error de conexión con el servidor');
    }
    finally {
      setIsSubmitting(false);
    }
  }
    , [selectedDay, difficulty, observations, onClose]);


  return {
    difficulty,
    observations,
    isSubmitting,
    formMessage,
    setDifficulty,
    setObservations,
    handleSubmit
  };
};

export default useProgressForm;