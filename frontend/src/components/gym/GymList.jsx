import React from 'react';
import GymCard from './GymCard';
import { FaBuilding } from 'react-icons/fa';
import './styles/GymList.css';

const GymList = ({ gyms, expandedGym, toggleGymExpansion, getOccupancyClass }) => {
  if (!gyms || gyms.length === 0) {
    return (
      <section className="no-gyms" role="status">
        <FaBuilding className="no-gyms-icon" aria-hidden="true" />
        <p>No hay gimnasios disponibles actualmente.</p>
      </section>
    );
  }

  return (
    <section className="gimnasios-list-wrapper">
      <h2 className="visually-hidden">Lista de gimnasios disponibles</h2>
      <section
        className="gimnasios-list"
        aria-label="Lista de gimnasios"
      >
        {gyms.map(gym => (
          <GymCard
            key={gym.id}
            gym={gym}
            expandedGym={expandedGym}
            toggleGymExpansion={toggleGymExpansion}
            getOccupancyClass={getOccupancyClass}
          />
        ))}
      </section>
    </section>
  );
};

export default GymList;