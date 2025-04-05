import React, { useState, useEffect } from 'react';
import SeriesList from './SeriesList';
import '../styles/ExerciseItem.css';

const ExerciseItem = ({
  day,
  exerciseIndex,
  exercise,
  muscleGroups,
  onRemoveExercise,
  onAddSeries,
  onRemoveSeries,
  // Props para el ejercicio
  allExercises,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseList, setShowExerciseList] = useState(!exercise.id);

  // Cuando se carga el componente o cambia el ejercicio, establecer el ejercicio seleccionado
  useEffect(() => {
    // Si el ejercicio ya tiene un ID (ya está seleccionado), busca sus detalles completos
    if (exercise.id) {
      // Buscar el ejercicio completo si ya tenemos su ID
      const matchingExercise = allExercises.find(ex => ex.id === parseInt(exercise.id));
      if (matchingExercise) {
        setSelectedExercise(matchingExercise);
        setShowExerciseList(false); // Ocultar la lista de selección
      }
    }
  }, [exercise.id, allExercises]);

  // Filtrar ejercicios basados en la búsqueda
  const filteredExercises = searchTerm
    ? allExercises.filter(ex =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.muscleGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : allExercises;

  // Manejar la selección de un ejercicio
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    // Actualizar el ID del ejercicio en el estado del padre
    if (exercise) {
      // Esto debería actualizar el ID en el estado del training
      document.querySelector(`input[name="exercise_${day}_${exerciseIndex}_id"]`).value = exercise.id;
    }
    setShowExerciseList(false);
  };

  // Manejar la deselección de un ejercicio
  const handleDeselectExercise = () => {
    setSelectedExercise(null);
    setShowExerciseList(true);
    // Limpiar el ID en el estado del padre
    if (document.querySelector(`input[name="exercise_${day}_${exerciseIndex}_id"]`)) {
      document.querySelector(`input[name="exercise_${day}_${exerciseIndex}_id"]`).value = '';
    }
  };

  return (
    <section className="exercise-container">
      <header className="exercise-header">
        <h4 className="exercise-title">Ejercicio {exerciseIndex + 1}</h4>
        <button
          type="button"
          className="remove-button"
          onClick={onRemoveExercise}
        >
          Eliminar Ejercicio
        </button>
      </header>

      <section className="exercise-details">
        <section className="form-field">
          <label>Ejercicio</label>

          {selectedExercise ? (
            <article className="selected-item">
              <span>{selectedExercise.name}</span>
              <span className="muscle-group-tag">{selectedExercise.muscleGroup}</span>
              <button
                type="button"
                className="deselect-button"
                onClick={handleDeselectExercise}
                aria-label="Eliminar ejercicio seleccionado"
              >
                ×
              </button>

              <input
                type="hidden"
                name={`exercise_${day}_${exerciseIndex}_id`}
                defaultValue={selectedExercise.id}
              />
            </article>
          ) : (
            <section className="exercise-selection">
              <main className="search-container">
                <input
                  type="text"
                  id={`search_${day}_${exerciseIndex}`}
                  placeholder="Buscar ejercicios por nombre o grupo muscular..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input search-input"
                  disabled={loading}
                  autoComplete="off"
                  aria-label="Buscar ejercicios"
                />
              </main>

              {showExerciseList && (
                <section className="exercise-list-field">
                  {loading ? (
                    <p className="loading-indicator">Cargando ejercicios...</p>
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
                          aria-label={`Seleccionar ${exercise.name}`}
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
                        ? "No se encontraron ejercicios que coincidan con la búsqueda"
                        : "No hay ejercicios disponibles"}
                    </article>
                  )}
                </section>
              )}
            </section>
          )}
        </section>

        {(selectedExercise || exercise.id) && (
          <SeriesList
            day={day}
            exerciseIndex={exerciseIndex}
            series={exercise.series}
            onAddSeries={onAddSeries}
            onRemoveSeries={onRemoveSeries}
          />
        )}
      </section>
    </section>
  );
};

export default ExerciseItem;