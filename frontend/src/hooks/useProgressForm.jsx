import { useState, useCallback } from 'react';
import { sendProgress } from '../services/UserService';

const useProgressForm = (selectedDay, onClose) => {
  const [difficulty, setDifficulty] = useState('normal');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      await sendProgress({
        day: selectedDay,
        difficulty,
        observations,
        date: new Date().toISOString()
      });

      setFormMessage({
        type: 'success',
        text: 'Progreso guardado'
      });

      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      setFormMessage({
        type: 'error',
        text: 'Error al guardar'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedDay, difficulty, observations, onClose]);

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