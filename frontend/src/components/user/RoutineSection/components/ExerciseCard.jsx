import React from 'react';
import { FaDumbbell } from 'react-icons/fa';
import '../styles/ExerciseCard.css';
import SeriesTable from './SeriesTable';

const ExerciseCard = ({ exercise, index }) => {
  return (
    <article
      className="exercise-card"
      style={{ '--index': index }}
    >
      <header className="exercise-header">
        <h3>{exercise.name}</h3>
        <span className="exercise-muscles">
          <FaDumbbell /> {exercise.muscles}
        </span>
      </header>
      <p className="exercise-description">{exercise.description}</p>
      <SeriesTable series={exercise.series} />
    </article>
  );
};

export default ExerciseCard;