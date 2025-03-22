import React from 'react';
import ExerciseCard from './ExerciseCard';
import { RestDayMessage } from './StatusStates';
import '../styles/ExerciseList.css';

const ExerciseList = ({ exercises, hasExercises, selectedDay }) => {
  return (
    <main className='exercise-list-container'>
      {hasExercises ? (
        <ul className="exercises-list">
          {exercises.map((exercise, idx) => (
            <li>
              <ExerciseCard
                key={`exercise-${selectedDay}-${idx}`}
                exercise={exercise}
                index={idx}
              />
            </li>
          ))}
        </ul>
      ) : (
        <RestDayMessage selectedDay={selectedDay} />
      )}
    </main>
  );
};

export default ExerciseList;