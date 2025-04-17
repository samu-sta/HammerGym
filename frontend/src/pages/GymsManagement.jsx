import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import { fetchAllGyms, updateGym, deleteGym } from '../services/GymService';

const GymsManagement = () => {
  const transformEntityForEdit = (gym) => {
    return Object.fromEntries(
      Object.entries(gym)
        .filter(([_, value]) => typeof value !== 'object' || value === null)
        .map(([key, value]) => {
          // Preservar valores numéricos (incluyendo 0) y otros tipos de valores
          if (value === 0 || typeof value === 'number' || typeof value === 'boolean') {
            return [key, value];
          }
          return [key, value || ''];
        })
    );
  }

  return (
    <EntityManagement
      title="Gimnasios"
      fetchEntities={fetchAllGyms}
      updateEntity={updateGym}
      deleteEntity={deleteGym}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
    />
  );
};

export default GymsManagement;