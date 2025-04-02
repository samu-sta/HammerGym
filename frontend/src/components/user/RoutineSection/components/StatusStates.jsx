import React from 'react';
import { FaClipboardList, FaSync, FaCalendarAlt } from 'react-icons/fa';
import '../styles/StatusStates.css';
import { dayMap } from '../../../../config/constants.js';

export const LoadingState = () => (
  <section className='user-routine'>
    <header className='section-header'>
      <FaClipboardList className='section-icon' />
      <h2>Mi Entrenamiento</h2>
    </header>
    <main className='routine-content loading-routine'>
      <figure className="loading-spinner"></figure>
      <p>Cargando tu rutina...</p>
    </main>
  </section>
);

export const ErrorState = ({ error, onRetry }) => (
  <section className='user-routine'>
    <header className='section-header'>
      <FaClipboardList className='section-icon' />
      <h2>Mi Entrenamiento</h2>
    </header>
    <main className='routine-content error-routine'>
      <p className="error-message">{error}</p>
      <button className="retry-button" onClick={onRetry}>
        <FaSync /> Reintentar
      </button>
    </main>
  </section>
);

export const EmptyState = () => (
  <section className='user-routine'>
    <header className='section-header'>
      <FaClipboardList className='section-icon' />
      <h2>Mi Entrenamiento</h2>
    </header>
    <main className='routine-content empty-routine'>
      <FaCalendarAlt className="empty-routine-icon" />
      <p>No tienes una rutina asignada actualmente</p>
    </main>
  </section>
);

export const RestDayMessage = ({ selectedDay }) => (
  <article className="rest-day-message">
    <FaCalendarAlt className="rest-icon" />
    <h3>{selectedDay ? "Sin Entrenamiento" : "Día de Descanso"}</h3>
    <p>No tienes ejercicios programados para {dayMap[selectedDay] || selectedDay}</p>
  </article>
);