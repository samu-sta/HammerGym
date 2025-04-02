import React from 'react';
import { FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';
import ActionButton from '../../../common/ActionButton';

const ErrorState = ({ error, handleCreateTraining }) => {
  return (
    <section className="error-message-user-list">
      <FaExclamationTriangle className="error-icon" />
      <p>{error}</p>
      {error === 'No users found with assigned training plans' && (
        <ActionButton
          icon={<FaUserPlus />}
          text="Asignar Tu Primer Plan de Entrenamiento"
          onClick={handleCreateTraining}
          className="create-training-button mt-4"
        />
      )}
    </section>
  );
};

export default ErrorState; 