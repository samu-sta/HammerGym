import React from 'react';
import ExerciseItem from './ExerciseItem';
import '../styles/TrainingDay.css';

const TrainingDay = ({
  day,
  exercises,
  series,
  muscleGroups,
  onRemoveDay,
  onAddExercise,
  onRemoveExercise,
  onAddSeries,
  onRemoveSeries,
  allExercises,
  loadingExercises,
  exerciseError
}) => {
  return (
    <article className="day-container">
      <input type="hidden" name={`days_${day}`} value={day} />

      <header className="day-header">
        <h3 className="day-title">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
        <button
          type="button"
          className="remove-button"
          onClick={onRemoveDay}
        >
          Remove Day
        </button>
      </header>

      {exercises.map((_, exerciseIndex) => (
        <ExerciseItem
          key={exerciseIndex}
          day={day}
          exerciseIndex={exerciseIndex}
          series={series[exerciseIndex] || []}
          muscleGroups={muscleGroups}
          onRemoveExercise={() => onRemoveExercise(exerciseIndex)}
          onAddSeries={() => onAddSeries(exerciseIndex)}
          onRemoveSeries={(seriesIndex) => onRemoveSeries(exerciseIndex, seriesIndex)}
          allExercises={allExercises}
          loading={loadingExercises}
          error={exerciseError}
        />
      ))}

      <footer className="day-footer">
        <button
          type="button"
          className="add-button"
          onClick={onAddExercise}
        >
          Add Exercise
        </button>
      </footer>
    </article>
  );
};

export default TrainingDay;