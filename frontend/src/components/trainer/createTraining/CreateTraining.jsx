import React from 'react';
import useTrainingForm from '../../../hooks/useCreateTraining';
import DaySelector from './components/DaySelector';
import TrainingDay from './components/TrainingDay';
import FormField from '../../auth/FormField';
import './styles/CreateTraining.css';

const CreateTraining = () => {
  const {
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
    allExercises,
    loadingExercises,
    exerciseError
  } = useTrainingForm();

  return (
    <main className="create-training-container">
      <header>
        <h2 className="page-title">Create Training Plan</h2>
      </header>

      <form className="training-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>User Information</legend>
          <FormField
            label="User Email"
            type="text"
            name="userEmail"
            value={training.userEmail}
            onChange={updateUserEmail}
            required
            placeholder="Enter user email"
          />
        </fieldset>

        {/* Rest of the component remains the same */}
        <fieldset>
          <legend>Training Schedule</legend>
          <DaySelector
            days={daysOfWeek}
            selectedDays={selectedDays}
            onToggleDay={toggleDay}
          />
        </fieldset>

        {selectedDays.length > 0 && (
          <section className="training-days">
            <h3>Daily Exercises</h3>
            {selectedDays.map(day => (
              <TrainingDay
                key={day}
                day={day}
                exercises={training.days[day]?.exercises || []}
                series={training.days[day]?.exercises.map(exercise => exercise.series) || []}
                muscleGroups={muscleGroups}
                onRemoveDay={() => toggleDay(day)}
                onAddExercise={() => addExercise(day)}
                onRemoveExercise={(exerciseIndex) => removeExercise(day, exerciseIndex)}
                onAddSeries={(exerciseIndex) => addSeries(day, exerciseIndex)}
                onRemoveSeries={(exerciseIndex, seriesIndex) => removeSeries(day, exerciseIndex, seriesIndex)}
                allExercises={allExercises}
                loadingExercises={loadingExercises}
                exerciseError={exerciseError}
              />
            ))}
          </section>
        )}

        <footer className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || selectedDays.length === 0}
          >
            {isSubmitting ? 'Creating...' : 'Create Training Plan'}
          </button>
        </footer>
      </form>

      {formMessage && (
        <section className={`form-message ${formMessage.type}`}>
          {formMessage.text}
        </section>
      )}
    </main>
  );
};

export default CreateTraining;