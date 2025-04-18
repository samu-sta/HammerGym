import React from 'react';
import './styles/LoadingSpinner.css';

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default LoadingSpinner;