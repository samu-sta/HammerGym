import React from 'react';
import { FaUserPlus, FaPlus } from 'react-icons/fa';
import ActionButton from '../../../common/ActionButton';

const EmptyState = ({ handleCreateTraining }) => {
  return (
    <section className="empty-state">
      <FaUserPlus className="empty-icon" />
      <p>Aún no tienes clientes asignados. Comienza creando un plan de entrenamiento para un usuario.</p>
      <ActionButton
        icon={<FaPlus />}
        text="Crear Tu Primer Plan de Entrenamiento"
        onClick={handleCreateTraining}
        className="create-training-button mt-4"
      />
    </section>
  );
};

export default EmptyState;