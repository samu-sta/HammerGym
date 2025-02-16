import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import './styles/RoutineSection.css';
const RoutineSection = ({ routine, selectedDay, setSelectedDay }) => {
  return (
    <section className='user-routine'>
      <header className='section-header'>
        <FaClipboardList className='section-icon' />
        <h2>Rutina Semanal</h2>
      </header>
      <div className='routine-content'>
        {selectedDay ? (
          <article className='routine-day-expanded'>
            <header className='routine-day-header'>
              <h3>{selectedDay}</h3>
              <button 
                className='routine-back-button'
                onClick={() => setSelectedDay(null)}
              >
                Volver
              </button>
            </header>
            {routine[selectedDay].length > 0 ? (
              <ul className='routine-exercises-list'>
                {routine[selectedDay].map((exercise, idx) => (
                  <li key={idx} className='routine-exercise-item'>
                    <div className='exercise-details'>
                      <h4 className='exercise-name'>{exercise.name}</h4>
                      <div className='exercise-meta'>
                        <span className='exercise-sets'>{exercise.sets} series</span>
                        <span className='exercise-separator'>•</span>
                        <span className='exercise-reps'>{exercise.reps} repeticiones</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='no-data'>Día de descanso</p>
            )}
          </article>
        ) : (
          <div className='routine-days-grid'>
            {Object.entries(routine).map(([day, exercises], index) => (
              <article 
                key={index} 
                className='routine-day'
                onClick={() => setSelectedDay(day)}
              >
                <h3>{day}</h3>
                <p className='routine-day-summary'>
                  {exercises.length > 0 
                    ? `${exercises.length} ejercicio${exercises.length !== 1 ? 's' : ''}`
                    : 'Descanso'}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoutineSection;