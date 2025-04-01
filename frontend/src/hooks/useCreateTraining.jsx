import { useState, useEffect } from 'react';
import { getAllExercises } from '../services/ExerciseService';
import { createUserTraining } from '../services/TrainingService';

const useTrainingForm = () => {
  const [training, setTraining] = useState({
    userId: '',
    days: {}
  });

  const [allExercises, setAllExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [exerciseError, setExerciseError] = useState(null);

  const [formMessage, setFormMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedData, setFormattedData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const muscleGroups = ['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs'];

  const selectedDays = Object.keys(training.days);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoadingExercises(true);
      setExerciseError(null);

      try {
        const data = await getAllExercises();

        if (data.success && Array.isArray(data.exercises)) {
          // Map API response format to the expected format in components
          const formattedExercises = data.exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            muscleGroup: exercise.muscles, // Map API's 'muscles' to component's 'muscleGroup'
            description: exercise.description
          }));
          setAllExercises(formattedExercises);
        } else {
          throw new Error(data.message || 'Invalid exercise data structure');
        }
      } catch (error) {
        console.error('Error in useTrainingForm:', error);
        setExerciseError('Failed to load exercises. Please try again.');
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchExercises();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);
    setIsSuccess(false);

    try {
      // Collect form data
      const trainingData = collectFormData(e.target);

      // Validate required fields
      if (!trainingData.userId) {
        throw new Error('User ID is required');
      }

      if (Object.keys(trainingData.days).length === 0) {
        throw new Error('At least one training day with exercises is required');
      }

      console.log('Submitting training data:', trainingData);
      setFormattedData(trainingData);

      // Send data to API
      console.log('Sending training data to API:', JSON.stringify(trainingData));
      const response = await createUserTraining(trainingData);

      if (response.success) {
        setIsSuccess(true);
        setFormMessage({
          type: 'success',
          text: 'Training plan created successfully!'
        });
      } else {
        throw new Error(response.message || 'Failed to create training plan');
      }

    } catch (error) {
      console.error('Error submitting training data:', error);
      setFormMessage({
        type: 'error',
        text: error.message || 'An error occurred while creating the training plan'
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
    formattedData,
    allExercises,
    loadingExercises,
    exerciseError,
    isSuccess
  };
};

export default useTrainingForm;