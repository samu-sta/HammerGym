import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import { fetchAllTrainers, updateTrainer, deleteTrainer } from '../services/TrainerService';

const TrainersManagement = () => {
  const transformEntityForEdit = (trainer) => {
    return Object.fromEntries(
      Object.entries(trainer)
        .filter(([_, value]) => typeof value !== 'object' || value === null)
        .map(([key, value]) => [key, value || ''])
    );
  }

  return (
    <EntityManagement
      title="Entrenadores"
      entityType="trainers"
      fetchEntities={fetchAllTrainers}
      updateEntity={updateTrainer}
      deleteEntity={deleteTrainer}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
    />
  );
};

export default TrainersManagement;