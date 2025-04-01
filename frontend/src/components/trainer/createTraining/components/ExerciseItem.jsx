import React, { useState } from 'react';
import SeriesList from './SeriesList';
import '../styles/ExerciseItem.css';

const ExerciseItem = ({
  day,
  exerciseIndex,
  series,
  muscleGroups,
  onRemoveExercise,
  onAddSeries,
  onRemoveSeries,
  // New props
  allExercises,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseList, setShowExerciseList] = useState(true);

  // No need for useEffect to fetch data anymore - we get it from props

  // Filter exercises based on search term
  const filteredExercises = searchTerm
    ? allExercises.filter(ex =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : allExercises;

  // Handle exercise selection
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseList(false);
  };

  // Handle exercise deselection
  const handleDeselectExercise = () => {
    setSelectedExercise(null);
    setShowExerciseList(true);
  };

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
        <section className="form-field">
          <label>Exercise</label>

          {selectedExercise ? (
            <article className="selected-item">
              <span>{selectedExercise.name}</span>
              <span className="muscle-group-tag">{selectedExercise.muscleGroup}</span>
              <button
                type="button"
                className="deselect-button"
                onClick={handleDeselectExercise}
                aria-label="Remove selected exercise"
              >
                ×
              </button>

              <input
                type="hidden"
                name={`exercise_${day}_${exerciseIndex}_id`}
                value={selectedExercise.id}
              />
            </article>
          ) : (
            <section className="exercise-selection">
              <main className="search-container">
                <input
                  type="text"
                  id={`search_${day}_${exerciseIndex}`}
                  placeholder="Search exercises by name or muscle group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input search-input"
                  disabled={loading}
                  autoComplete="off"
                  aria-label="Search exercises"
                />
              </main>

              {showExerciseList && (
                <section className="exercise-list-field">
                  {loading ? (
                    <p className="loading-indicator">Loading exercises...</p>
                  ) : error ? (
                    <p className="error-message">{error}</p>
                  ) : filteredExercises.length > 0 ? (
                    <ul className="exercise-list">
                      {filteredExercises.map(exercise => (
                        <li
                          key={exercise.id}
                          className="exercise-option"
                          onClick={() => handleExerciseSelect(exercise)}
                          tabIndex="0"
                          role="button"
                          aria-label={`Select ${exercise.name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleExerciseSelect(exercise);
                            }
                          }}
                          title={exercise.description}
                        >
                          <span className="exercise-name">{exercise.name}</span>
                          <span className="exercise-muscle-group">{exercise.muscleGroup}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <article className="no-exercises">
                      {searchTerm
                        ? "No exercises match your search"
                        : "No exercises available"}
                    </article>
                  )}
                </section>
              )}
            </section>
          )}
        </section>

        {selectedExercise && (
          <SeriesList
            day={day}
            exerciseIndex={exerciseIndex}
            series={series}
            onAddSeries={onAddSeries}
            onRemoveSeries={onRemoveSeries}
          />
        )}
      </section>
    </section>
  );
};

export default ExerciseItem;