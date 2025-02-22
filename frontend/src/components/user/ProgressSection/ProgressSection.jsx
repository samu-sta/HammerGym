import React from 'react';
import { FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import './styles/ProgressSection.css';
const ProgressSection = ({ progress }) => {
  return (
    <section className='user-progress'>
      <header className='section-header'>
        <FaDumbbell className='section-icon' />
        <h2>Progreso</h2>
      </header>
      <section className='progress-content'>
        {progress.length > 0 ? (
          progress.map((day, index) => (
            <article key={index} className='progress-day'>
              <header className='progress-date'>
                <FaCalendarAlt />
                <strong>{new Date(day.date).toLocaleDateString()}</strong>
              </header>
              <ul className='exercises-list'>
                {day.exercises.map((exercise, idx) => (
                  <li key={idx} className='exercise-item'>
                    <span className='exercise-name'>{exercise.name}</span>
                    <span className='exercise-reps'>{exercise.repetitions} reps</span>
                  </li>
                ))}
              </ul>
            </article>
          ))
        ) : (
          <p className='no-data'>No hay progreso registrado.</p>
        )}
      </section>
    </section>
  );
};

export default ProgressSection;