import InputProfileSection from '../../user/ProfileSection/components/InputProfileSection.jsx';
import DaySelector from './components/DaySelector';
import TrainingDay from './components/TrainingDay';
import useTrainingForm from '../../../hooks/useCreateTraining.jsx';
import './styles/CreateTraining.css';

const CreateTraining = () => {
  const {
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
    handleSubmit
  } = useTrainingForm();

  return (
    <main className="create-training-container">
      <h2 className="page-title">Create Training Plan</h2>

      <form className="training-form" onSubmit={handleSubmit}>
        <InputProfileSection
          label="User ID"
          name="userId"
          type="number"
          required
          min="1"
          max="999999999"
        />

        <DaySelector 
          days={daysOfWeek} 
          selectedDays={selectedDays} 
          onToggleDay={toggleDay} 
        />

        {selectedDays.map(day => (
          <TrainingDay
            key={day}
            day={day}
            exercises={exercises[day] || []}
            series={series[day] || {}}
            muscleGroups={muscleGroups}
            onRemoveDay={() => toggleDay(day)}
            onAddExercise={() => addExercise(day)}
            onRemoveExercise={(exerciseIndex) => removeExercise(day, exerciseIndex)}
            onAddSeries={(exerciseIndex) => addSeries(day, exerciseIndex)}
            onRemoveSeries={(exerciseIndex, seriesIndex) => removeSeries(day, exerciseIndex, seriesIndex)}
          />
        ))}

        <footer className="form-footer">
          <button
            type="submit"
            className="submit-button"
            disabled={selectedDays.length === 0}
          >
            Create Training Plan
          </button>
        </footer>
      </form>
    </main>
  );
};

export default CreateTraining;