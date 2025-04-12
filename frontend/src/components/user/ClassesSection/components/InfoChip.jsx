import React from 'react';
import '../styles/InfoChip.css';

const InfoChip = ({ icon, className = '', children }) => {
  const Icon = icon;
  return (
    <span className={`info-chip ${className}`}>
      {Icon && <Icon />} {children}
    </span>
  );
};

export default InfoChip;