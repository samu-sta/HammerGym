import { useState, useEffect } from 'react';
import { getAllExercises } from '../services/ExerciseService';
import { createUserTraining, getTrainingByUserEmail } from '../services/TrainingService';
import { useParams } from 'react-router-dom';

const useTrainingForm = () => {
  const [training, setTraining] = useState({
    userEmail: '',
    days: {}
  });

  const { userEmail } = useParams();

  useEffect(() => {
    const fetchUserTraining = async () => {
      try {
        const response = await getTrainingByUserEmail(userEmail);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch training data');
        }
        const trainingData = response.training;
        const formattedTraining = {
          userEmail: userEmail,
          days: {}
        };

        Object.entries(trainingData.days).forEach(([dayName, dayData]) => {
          formattedTraining.days[dayName] = {
            exercises: dayData.exercises.map(exercise => ({
              id: exercise.id,
              name: exercise.name,
              muscleGroup: exercise.muscles,
              description: exercise.description,
              series: exercise.series.map(serie => ({
                reps: serie.reps,
                weight: serie.weight
              }))
            }))
          };
        });
        console.log('Formatted training data:', formattedTraining);
        setTraining(formattedTraining);
      }
      catch (error) {
        console.error('Error fetching training data:', error);
        setTraining({
          userEmail: '',
          days: {}
        });
      }
    };

    if (userEmail) {
      fetchUserTraining();
    }
  }, [userEmail]);


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

  // Fetch exercises - no change needed here
  useEffect(() => {
    const fetchExercises = async () => {
      setLoadingExercises(true);
      setExerciseError(null);

      try {
        const data = await getAllExercises();

        if (data && Array.isArray(data)) {
          const formattedExercises = data.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            muscleGroup: exercise.muscles,
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

  const updateUserEmail = (e) => {
    const userEmail = e.target.value;
    setTraining(prev => ({
      ...prev,
      userEmail
    }));
  };

  const collectFormData = (form) => {
    const formData = new FormData(form);
    const userEmail = formData.get('userEmail'); // Changed from userId

    const trainingData = {
      userEmail: userEmail || '',  // Changed from userId
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

      // Validate required fields - check email instead of userId
      if (!trainingData.userEmail) {
        throw new Error('User email is required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trainingData.userEmail)) {
        throw new Error('Please enter a valid email address');
      }

      if (Object.keys(trainingData.days).length === 0) {
        throw new Error('At least one training day with exercises is required');
      }

      console.log('Submitting training data:', trainingData);
      setFormattedData(trainingData);

      // Send data to API
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
    updateUserEmail,
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