import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import { RestDayMessage } from './StatusStates';
import ProgressForm from '../../ProgressSection/ProgressForm';
import { FaClipboardCheck } from 'react-icons/fa';
import '../styles/ExerciseList.css';

const ExerciseList = ({ exercises, hasExercises, selectedDay }) => {
  const [showProgressForm, setShowProgressForm] = useState(false);

  return (
    <section className='exercise-list-container'>
      {hasExercises ? (
        <>
          <ul className="exercises-list">
            {exercises.map((exercise, idx) => (
              <li key={`exercise-${selectedDay}-${idx}`}>
                <ExerciseCard
                  exercise={exercise}
                  index={idx}
                />
              </li>
            ))}
          </ul>

          {!showProgressForm ? (
            <button
              className="record-progress-button"
              onClick={() => setShowProgressForm(true)}
            >
              <FaClipboardCheck />
              <span>Registrar mi progreso de hoy</span>
            </button>
          ) : (
            <ProgressForm
              selectedDay={selectedDay}
              onClose={() => setShowProgressForm(false)}
            />
          )}
        </>
      ) : (
        <RestDayMessage selectedDay={selectedDay} />
      )}
    </section>
  );
};

export default ExerciseList;