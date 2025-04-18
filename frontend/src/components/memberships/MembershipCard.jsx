import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './styles/MembershipCard.css';

const MembershipCard = ({ membership, onSelect, isSelected }) => {
  const { id, type, price } = membership;

  // Define features based on membership type
  const getFeatures = () => {
    switch (type.toLowerCase()) {
      case 'básico':
      case 'basico':
        return [
          'Acceso a área de pesas',
          'Acceso a cardio',
          'Horario limitado (6am - 10pm)'
        ];
      case 'premium':
        return [
          'Acceso a área de pesas',
          'Acceso a cardio',
          'Acceso a clases grupales',
          'Acceso 24/7'
        ];
      case 'vip':
        return [
          'Acceso a área de pesas',
          'Acceso a cardio',
          'Acceso a clases grupales',
          'Acceso a spa',
          'Entrenador personal',
          'Acceso 24/7'
        ];
      default:
        return ['Características no especificadas'];
    }
  };

  return (
    <div className={`membership-card ${isSelected ? 'selected' : ''}`}>
      <div className="membership-card-header">
        <h4>{type}</h4>
        {isSelected && <span className="membership-card-badge">Seleccionado</span>}
      </div>
      <div className="membership-card-body">
        <div className="membership-card-price">
          <h2>${price}</h2>
          <small>por mes</small>
        </div>
        <ul className="membership-features">
          {getFeatures().map((feature, index) => (
            <li key={index} className="membership-feature">
              <FaCheck className="feature-icon" /> {feature}
            </li>
          ))}
        </ul>
        <button
          className={`membership-select-button ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect(membership)}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;