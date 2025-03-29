import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import FormHeader from './components/FormHeader';
import DifficultySelector from './components/DifficultySelector';
import ObservationsField from './components/ObservationsField';
import FormMessage from './components/FormMessage';
import useProgressForm from '../../../hooks/useProgressForm';
import './styles/ProgressForm.css';

const ProgressForm = ({ selectedDay, trainingId, onClose }) => {
  const {
    difficulty,
    observations,
    isSubmitting,
    formMessage,
    setDifficulty,
    setObservations,
    handleSubmit
  } = useProgressForm(selectedDay, trainingId, onClose);

  return (
    <section className="progress-form-container">
      <FormHeader selectedDay={selectedDay} onClose={onClose} />
      <form className="progress-form" onSubmit={handleSubmit}>
        <DifficultySelector
          difficulty={difficulty}
          onChange={setDifficulty}
        />
        <ObservationsField
          value={observations}
          onChange={setObservations}
        />
        {formMessage && <FormMessage message={formMessage} />}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          <FaPaperPlane />
          <span>{isSubmitting ? 'Guardando...' : 'Guardar'}</span>
        </button>
      </form>
    </section>
  );
};

export default ProgressForm;