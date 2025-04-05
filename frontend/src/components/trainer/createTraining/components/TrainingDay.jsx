import React from 'react';
import ExerciseItem from './ExerciseItem';
import '../styles/TrainingDay.css';
import { translateDay } from '../../../../config/constants';

const TrainingDay = ({
  day,
  exercises,
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
        <h3 className="day-title">{translateDay(day)}</h3>
        <button
          type="button"
          className="remove-button"
          onClick={onRemoveDay}
        >
          Eliminar Día
        </button>
      </header>

      {exercises.map((exercise, exerciseIndex) => (
        <ExerciseItem
          key={exerciseIndex}
          day={day}
          exerciseIndex={exerciseIndex}
          exercise={exercise}
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
          Añadir Ejercicio
        </button>
      </footer>
    </article>
  );
};

export default TrainingDay;