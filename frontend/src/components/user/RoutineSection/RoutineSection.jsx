import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import './styles/RoutineSection.css';
import { dayMap } from '../../../config/constants.js';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const RoutineSection = ({ routine, selectedDay, setSelectedDay }) => {
  return (
    <section className='user-routine'>
      <header className='section-header'>
        <FaClipboardList className='section-icon' />
        <h2>Rutina Semanal</h2>
      </header>
      <main className='routine-content'>
        {selectedDay ? (
          <article className='routine-day-expanded'>
            <header className='routine-day-header'>
              <button
                className='routine-back-button'
                onClick={() => setSelectedDay(null)}
              >
                <FaLongArrowAltLeft /> Volver
              </button>
              <h3>{selectedDay}</h3>

            </header>
            {routine[selectedDay].length > 0 ? (
              <ul className='routine-exercises-list'>
                {routine[selectedDay].map((exercise, idx) => (
                  <li key={idx} className='routine-exercise-item'>
                    <section className='exercise-details'>
                      <h4 className='exercise-name'>{exercise.name}</h4>
                      <section className='exercise-meta'>
                        <span className='exercise-sets'>{exercise.sets} series</span>
                        <span className='exercise-separator'>•</span>
                        <span className='exercise-reps'>{exercise.reps} repeticiones</span>
                      </section>
                    </section>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='no-data'>Día de descanso</p>
            )}
          </article>
        ) : (<>
          {Object.entries(routine).map(([day, exercises], index) => (
            <article
              key={index}
              className={`routine-day ${exercises.length == 0 ? 'rest-day' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <h3>{dayMap[day] || day}</h3>
              <p className='routine-day-summary'>
                {exercises.length > 0
                  ? `${exercises.length} ejercicio${exercises.length !== 1 ? 's' : ''}`
                  : 'Descanso'}
              </p>
            </article>
          ))}
        </>
        )}
      </main>
    </section>
  );
};

export default RoutineSection;