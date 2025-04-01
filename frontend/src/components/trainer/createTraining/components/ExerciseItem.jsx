import React, { useState, useEffect } from 'react';
import SeriesList from './SeriesList';
import '../styles/ExerciseItem.css';

const ExerciseItem = ({
  day,
  exerciseIndex,
  series,
  muscleGroups,
  onRemoveExercise,
  onAddSeries,
  onRemoveSeries
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseList, setShowExerciseList] = useState(true);

  // Load all exercises on component mount
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      // This would be your actual API fetch for all exercises
      const exercises = [
        // Biceps
        { id: 101, name: "Barbell Curl", muscleGroup: "biceps" },
        { id: 102, name: "Dumbbell Curl", muscleGroup: "biceps" },
        { id: 103, name: "Hammer Curl", muscleGroup: "biceps" },
        { id: 104, name: "Preacher Curl", muscleGroup: "biceps" },
        { id: 105, name: "Concentration Curl", muscleGroup: "biceps" },
        // Triceps
        { id: 201, name: "Tricep Pushdown", muscleGroup: "triceps" },
        { id: 202, name: "Skull Crusher", muscleGroup: "triceps" },
        { id: 203, name: "Dips", muscleGroup: "triceps" },
        { id: 204, name: "Overhead Extension", muscleGroup: "triceps" },
        { id: 205, name: "Diamond Push-Up", muscleGroup: "triceps" },
        // Back
        { id: 301, name: "Pull-Up", muscleGroup: "back" },
        { id: 302, name: "Lat Pulldown", muscleGroup: "back" },
        { id: 303, name: "Bent Over Row", muscleGroup: "back" },
        { id: 304, name: "Deadlift", muscleGroup: "back" },
        { id: 305, name: "T-Bar Row", muscleGroup: "back" },
        // Chest
        { id: 401, name: "Bench Press", muscleGroup: "chest" },
        { id: 402, name: "Push-Up", muscleGroup: "chest" },
        { id: 403, name: "Dumbbell Fly", muscleGroup: "chest" },
        { id: 404, name: "Cable Crossover", muscleGroup: "chest" },
        { id: 405, name: "Incline Bench Press", muscleGroup: "chest" },
        // Shoulders
        { id: 501, name: "Shoulder Press", muscleGroup: "shoulders" },
        { id: 502, name: "Lateral Raise", muscleGroup: "shoulders" },
        { id: 503, name: "Front Raise", muscleGroup: "shoulders" },
        { id: 504, name: "Reverse Fly", muscleGroup: "shoulders" },
        { id: 505, name: "Shrugs", muscleGroup: "shoulders" },
        // Legs
        { id: 601, name: "Squat", muscleGroup: "legs" },
        { id: 602, name: "Leg Press", muscleGroup: "legs" },
        { id: 603, name: "Lunge", muscleGroup: "legs" },
        { id: 604, name: "Leg Extension", muscleGroup: "legs" },
        { id: 605, name: "Leg Curl", muscleGroup: "legs" },
        { id: 606, name: "Romanian Deadlift", muscleGroup: "legs" },
        { id: 607, name: "Calf Raise", muscleGroup: "legs" },
        { id: 608, name: "Hip Thrust", muscleGroup: "legs" },
        { id: 609, name: "Glute Bridge", muscleGroup: "legs" },
        { id: 610, name: "Hack Squat", muscleGroup: "legs" },
      ];

      setAllExercises(exercises);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Filter exercises based on search term
  const filteredExercises = searchTerm
    ? allExercises.filter(ex =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
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