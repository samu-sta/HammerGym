import { useState } from 'react';

const useTrainingForm = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [exercises, setExercises] = useState({});
  const [series, setSeries] = useState({});
  const [formMessage, setFormMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedData, setFormattedData] = useState(null);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const muscleGroups = ['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));

      // Clean up exercises for this day
      const updatedExercises = { ...exercises };
      delete updatedExercises[day];
      setExercises(updatedExercises);

      // Clean up series for this day
      const updatedSeries = { ...series };
      delete updatedSeries[day];
      setSeries(updatedSeries);
    } else {
      setSelectedDays([...selectedDays, day]);
      setExercises({ ...exercises, [day]: [0] });
      setSeries({ ...series, [day]: { 0: [0] } });
    }
  };

  const addExercise = (day) => {
    const newIndex = exercises[day].length;
    setExercises({
      ...exercises,
      [day]: [...exercises[day], newIndex]
    });
    setSeries({
      ...series,
      [day]: {
        ...series[day],
        [newIndex]: [0]
      }
    });
  };

  const removeExercise = (day, exerciseIndex) => {
    const updatedExercises = { ...exercises };
    updatedExercises[day] = exercises[day].filter((_, i) => i !== exerciseIndex);

    // Remap indices to keep them sequential
    const remappedExercises = updatedExercises[day].map((_, i) => i);
    updatedExercises[day] = remappedExercises;

    const updatedSeries = { ...series };
    
    // Create new series object with remapped keys
    const newDaySeries = {};
    updatedExercises[day].forEach((_, i) => {
      const oldIndex = exercises[day][i];
      if (updatedSeries[day][oldIndex]) {
        newDaySeries[i] = updatedSeries[day][oldIndex];
      }
    });
    
    updatedSeries[day] = newDaySeries;

    setExercises(updatedExercises);
    setSeries(updatedSeries);
  };

  const addSeries = (day, exerciseIndex) => {
    const currentSeries = series[day][exerciseIndex] || [];
    const newSeriesIndex = currentSeries.length;

    setSeries({
      ...series,
      [day]: {
        ...series[day],
        [exerciseIndex]: [...currentSeries, newSeriesIndex]
      }
    });
  };

  const removeSeries = (day, exerciseIndex, seriesIndex) => {
    const updatedSeries = { ...series };
    updatedSeries[day][exerciseIndex] = series[day][exerciseIndex].filter((_, i) => i !== seriesIndex);

    setSeries(updatedSeries);
  };

  const collectFormData = (form) => {
    const formData = new FormData(form);
    const userId = formData.get('userId');
    
    if (!userId) {
      return { success: false, message: 'User ID is required' };
    }

    // Prepare the training structure
    const trainingData = {
      userId: parseInt(userId),
      days: {}
    };

    // For each selected day
    for (const day of selectedDays) {
      const dayExercises = [];

      // For each exercise in this day
      if (exercises[day]) {
        for (const exerciseIndex of exercises[day]) {
          const exerciseId = formData.get(`exercise_${day}_${exerciseIndex}_id`);
          
          if (!exerciseId) {
            continue; // Skip if no exercise ID
          }

          const exerciseSeries = [];
          
          // For each series of this exercise
          if (series[day] && series[day][exerciseIndex]) {
            for (const seriesIndex of series[day][exerciseIndex]) {
              const reps = formData.get(`series_${day}_${exerciseIndex}_${seriesIndex}_reps`);
              const weight = formData.get(`series_${day}_${exerciseIndex}_${seriesIndex}_weight`);
              
              if (reps && weight) {
                exerciseSeries.push({
                  reps: parseInt(reps),
                  weight: parseFloat(weight)
                });
              }
            }
          }

          // Only add exercise if it has series
          if (exerciseSeries.length > 0) {
            dayExercises.push({
              id: parseInt(exerciseId),
              series: exerciseSeries
            });
          }
        }
      }

      // Only add day if it has exercises
      if (dayExercises.length > 0) {
        trainingData.days[day] = {
          exercises: dayExercises
        };
      }
    }

    return { success: true, data: trainingData };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    const result = collectFormData(e.target);
    
    if (!result.success) {
      setFormMessage({ type: 'error', text: result.message });
      setIsSubmitting(false);
      return;
    }

    // Store the formatted data and display it for debugging
    setFormattedData(result.data);
    
    // Better console logging with formatting
    console.log('Training data ready to submit:');
    console.log(JSON.stringify(result.data, null, 2));
    
    // Show success message without making the API call
    setFormMessage({ 
      type: 'success', 
      text: 'Training data collected successfully! Check the console for the formatted data.'
    });
    
    setIsSubmitting(false);
    
    // Return the data for any external handling if needed
    return result.data;
  };

  return {
    selectedDays,
    exercises,
    series,
    daysOfWeek,
    muscleGroups,
    toggleDay,
    addExercise,
    removeExercise,
    addSeries,
    removeSeries,
    handleSubmit,
    formMessage,
    isSubmitting,
    formattedData  // Expose formatted data if needed in the UI
  };
};

export default useTrainingForm;