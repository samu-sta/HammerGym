import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './styles/MembershipCard.css';

const MembershipCard = ({ membership, onSelect, isSelected }) => {
  const { id, type, price, features } = membership;

  return (
    <article className={`membership-card ${isSelected ? 'selected' : ''}`}>
      <header className="membership-card-header">
        <h4>{type}</h4>
        {isSelected && <span className="membership-card-badge">Seleccionado</span>}
      </header>
      <section className="membership-card-body">
        <section className="membership-card-price">
          <h2>${price}</h2>
          <small>por mes</small>
        </section>
        <ul className="membership-features">
          {features && features.length > 0 ? (
            features.map((feature) => (
              <li key={feature.id} className="membership-feature">
                <FaCheck className="feature-icon" /> {feature.description}
              </li>
            ))
          ) : (
            <li className="membership-feature">
              <FaCheck className="feature-icon" /> Características no especificadas
            </li>
          )}
        </ul>
        <button
          className={`membership-select-button ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect(membership)}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
      </section>
    </article>
  );
};

export default MembershipCard;