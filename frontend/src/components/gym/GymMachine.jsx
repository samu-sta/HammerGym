import React from 'react';
import InfoChip from '../common/InfoChip';
import { FaIndustry, FaTools } from 'react-icons/fa';
import './styles/GymMachine.css';

const GymMachine = ({ machine }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'broken': return 'En reparación';
      case 'preparing': return 'En mantenimiento';
      case 'outOfService': return 'Fuera de servicio';
      default: return 'No especificado';
    }
  };

  return (
    <li className="machine-item">
      <h4 className="machine-name">
        {machine.model && machine.model.name
          ? machine.model.name
          : machine.name || 'Máquina sin nombre'}
      </h4>
      <section className="machine-details">
        {machine.model && machine.model.brand && (
          <InfoChip icon={FaIndustry}>
            {machine.model.brand}
          </InfoChip>
        )}

        {machine.model && machine.model.description && (
          <p className="machine-description">
            <strong>Descripción:</strong> {machine.model.description}
          </p>
        )}

        <InfoChip
          icon={FaTools}
          className={`status-${machine.status || 'unknown'}`}
        >
          {getStatusLabel(machine.status)}
        </InfoChip>

        {machine.lastMaintenance && (
          <p className="maintenance-date">
            <strong>Última Mantención:</strong> {new Date(machine.lastMaintenance).toLocaleDateString()}
          </p>
        )}
      </section>
    </li>
  );
};

export default GymMachine;