import { useState } from 'react';

const useTrainingForm = () => {
  const [training, setTraining] = useState({
    userId: '',
    days: {}
  });

  const [formMessage, setFormMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedData, setFormattedData] = useState(null);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const muscleGroups = ['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs'];

  const selectedDays = Object.keys(training.days);

  const toggleDay = (day) => {
    setTraining(prev => {
      const updatedDays = { ...prev.days };

      if (updatedDays[day]) {
        const { [day]: removedDay, ...restDays } = updatedDays;
        return {
          ...prev,
          days: restDays
        };
      } else {
        return {
          ...prev,
          days: {
            ...updatedDays,
            [day]: {
              exercises: [{
                id: '',
                series: [{
                  reps: '',
                  weight: ''
                }]
              }]
            }
          }
        };
      }
    });
  };

  const addExercise = (day) => {
    setTraining(prev => {
      const dayExercises = prev.days[day]?.exercises || [];

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: {
            exercises: [
              ...dayExercises,
              {
                id: '',
                series: [{
                  reps: '',
                  weight: ''
                }]
              }
            ]
          }
        }
      };
    });
  };

  const removeExercise = (day, exerciseIndex) => {
    setTraining(prev => {
      const updatedExercises = prev.days[day]?.exercises.filter((_, i) => i !== exerciseIndex);

      return {
        ...prev,
        days: {
          ...prev.days,
          [day]: {
            exercises: updatedExercises
          }
        }
      };
    });
  };

  const addSeries = (day, exerciseIndex) => {
    setTraining(prev => {
      const updatedDays = { ...prev.days };
      const dayData = { ...updatedDays[day] };
      const exercises = [...dayData.exercises];
      const exercise = { ...exercises[exerciseIndex] };

      exercise.series = [
        ...exercise.series,
        { reps: '', weight: '' }
      ];

      exercises[exerciseIndex] = exercise;
      dayData.exercises = exercises;
      updatedDays[day] = dayData;

      return {
        ...prev,
        days: updatedDays
      };
    });
  };

  const removeSeries = (day, exerciseIndex, seriesIndex) => {
    setTraining(prev => {
      const updatedDays = { ...prev.days };
      const dayData = { ...updatedDays[day] };
      const exercises = [...dayData.exercises];
      const exercise = { ...exercises[exerciseIndex] };

      exercise.series = exercise.series.filter((_, i) => i !== seriesIndex);

      exercises[exerciseIndex] = exercise;
      dayData.exercises = exercises;
      updatedDays[day] = dayData;

      return {
        ...prev,
        days: updatedDays
      };
    });
  };

  const updateUserId = (userId) => {
    setTraining(prev => ({
      ...prev,
      userId
    }));
  };

  const collectFormData = (form) => {
    const formData = new FormData(form);
    const userId = formData.get('userId');

    const trainingData = {
      userId: userId ? parseInt(userId) : '',
      days: {}
    };

    for (const day of selectedDays) {
      const exercises = [];

      for (let i = 0; i < 20; i++) {
        const exerciseId = formData.get(`exercise_${day}_${i}_id`);

        if (exerciseId) {
          const series = [];

          for (let j = 0; j < 20; j++) {
            const reps = formData.get(`series_${day}_${i}_${j}_reps`);
            const weight = formData.get(`series_${day}_${i}_${j}_weight`);

            if (reps && weight) {
              series.push({
                reps: parseInt(reps),
                weight: parseFloat(weight)
              });
            }
          }

          if (series.length > 0) {
            exercises.push({
              id: parseInt(exerciseId),
              series
            });
          }
        }
      }

      if (exercises.length > 0) {
        trainingData.days[day] = {
          exercises
        };
      }
    }

    return trainingData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const cleanedTraining = collectFormData(e.target);
      console.log('Submitting training data:', cleanedTraining);

      setFormattedData(cleanedTraining);

      console.log('Training data ready to submit:');
      console.log(JSON.stringify(cleanedTraining, null, 2));

      setFormMessage({
        type: 'success',
        text: 'All data collected successfully!'
      });

      return cleanedTraining;
    } catch (error) {
      console.error('Error collecting form data:', error);
      setFormMessage({
        type: 'error',
        text: 'Error collecting form data: ' + error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    training,
    selectedDays,
    daysOfWeek,
    muscleGroups,
    toggleDay,
    addExercise,
    removeExercise,
    addSeries,
    removeSeries,
    updateUserId,
    handleSubmit,
    formMessage,
    isSubmitting,
    formattedData
  };
};

export default useTrainingForm;