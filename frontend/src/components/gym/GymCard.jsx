import React from 'react';
import InfoChip from '../common/InfoChip';
import MachinesList from './MachinesList';
import { FaPhone, FaUsers, FaClock, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import './styles/GymCard.css';

const GymCard = ({ gym, expandedGym, toggleGymExpansion, getOccupancyClass }) => {
  const isExpanded = expandedGym === gym.id;

  return (
    <article className="gimnasio-card">
      <header
        className="gimnasio-header"
        onClick={() => toggleGymExpansion(gym.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleGymExpansion(gym.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`gym-content-${gym.id}`}
      >
        <h2>
          <FaMapMarkerAlt aria-hidden="true" className="location-icon" />
          {gym.location || gym.name}
        </h2>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">
          <FaChevronDown />
        </span>
      </header>

      <section className="gimnasio-info">
        <nav className="gym-infochips">
          <InfoChip
            icon={FaPhone}
            label="Teléfono"
          >
            <a
              href={`tel:${gym.telephone}`}
              className="phone-link"
              aria-label={`Llamar al gimnasio ${gym.location || gym.name}: ${gym.telephone || 'No disponible'}`}
            >
              {gym.telephone || 'No disponible'}
            </a>
          </InfoChip>

          <InfoChip
            icon={FaUsers}
            className={getOccupancyClass(gym.currentOccupancy, gym.maxCapacity)}
            label="Ocupación actual"
          >
            <span aria-label={`Ocupación actual: ${gym.currentOccupancy || 0} de ${gym.maxCapacity || 0} personas`}>
              {gym.currentOccupancy || 0}/{gym.maxCapacity || 0} personas
            </span>
          </InfoChip>

          {gym.scheduleOpen && gym.scheduleClose && (
            <InfoChip
              icon={FaClock}
              label="Horario"
            >
              <span aria-label={`Horario de ${gym.scheduleOpen} a ${gym.scheduleClose}`}>
                Horario: {gym.scheduleOpen} - {gym.scheduleClose}
              </span>
            </InfoChip>
          )}
        </nav>
      </section>

      {isExpanded && (
        <section
          id={`gym-content-${gym.id}`}
          className="gimnasio-expanded-content"
        >
          <MachinesList machines={gym.machines} />
        </section>
      )}
    </article>
  );
};

export default GymCard;