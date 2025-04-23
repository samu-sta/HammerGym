import React from 'react';
import './styles/InfoChip.css';

const InfoChip = ({ icon: Icon, children, className = '' }) => {
  return (
    <span className={`info-chip ${className}`}>
      {Icon && <Icon className="info-chip-icon" />}
      <span className="info-chip-text">{children}</span>
    </span>
  );
};

export default InfoChip;