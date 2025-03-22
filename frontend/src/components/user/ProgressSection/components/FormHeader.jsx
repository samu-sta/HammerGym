import React from 'react';
import { FaClipboardCheck, FaTimes } from 'react-icons/fa';
import { dayMap } from '../../../../config/constants';
import '../styles/FormHeader.css';

const FormHeader = ({ selectedDay, onClose }) => {
  return (
    <header className="progress-form-header">
      <div className="header-content">
        <FaClipboardCheck className="header-icon" />
        <h3>Progreso <span className="day-name">{dayMap[selectedDay]}</span></h3>
      </div>
      <button
        className="close-button"
        onClick={onClose}
        aria-label="Cerrar"
        type="button"
      >
        <FaTimes />
      </button>
    </header>
  );
};

export default FormHeader;