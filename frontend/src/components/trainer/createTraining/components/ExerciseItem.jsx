import React from 'react';
import SeriesList from './SeriesList';
import FormField from '../../../auth/FormField';
import '../styles/ExerciseItem.css';

const ExerciseItem = ({ 
  day, 
  exerciseIndex, 
  series, 
  onRemoveExercise, 
  onAddSeries, 
  onRemoveSeries 
}) => {
  return (
    <section className="exercise-container">
      <header className="exercise-header">
        <h4 className="exercise-title">Exercise {exerciseIndex + 1}</h4>
        <button
          type="button"
          className="remove-button"
          onClick={onRemoveExercise}
        >
          Remove Exercise
        </button>
      </header>

      <section className="exercise-details">
          <FormField
            name={`exercise_${day}_${exerciseIndex}`}
            label="Id del ejercicio"
            type="text"
            placeholder="Enter exercise name"
            required
            className="form-input"
          />

        <SeriesList
          day={day}
          exerciseIndex={exerciseIndex}
          series={series}
          onAddSeries={onAddSeries}
          onRemoveSeries={onRemoveSeries}
        />
      </section>
    </section>
  );
};

export default ExerciseItem;