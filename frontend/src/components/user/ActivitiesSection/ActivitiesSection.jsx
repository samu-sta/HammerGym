import React from 'react';
import { FaHistory } from 'react-icons/fa';
import './styles/ActivitiesSection.css';
const ActivitiesSection = ({ activities }) => {
  return (
    <section className='user-activities'>
      <header className='section-header'>
        <FaHistory className='section-icon' />
        <h2>Actividades Recientes</h2>
      </header>
      <div className='activities-content'>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <article key={index} className='activity-item'>
              <span className='activity-type'>{activity.type}</span>
              <span className='activity-date'>{new Date(activity.date).toLocaleString()}</span>
            </article>
          ))
        ) : (
          <p className='no-data'>No hay actividades recientes.</p>
        )}
      </div>
    </section>
  );
};

export default ActivitiesSection;