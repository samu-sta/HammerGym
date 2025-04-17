import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import {
  fetchAllMachineModels,
  updateMachineModel,
  deleteMachineModel,
  createMachineModel
} from '../services/MachineModelService';

const MachineModelsManagement = () => {
  const transformEntityForEdit = (machineModel) => {
    return Object.fromEntries(
      Object.entries(machineModel)
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
      title="Modelos de Máquina"
      entityType="machineModels"
      fetchEntities={fetchAllMachineModels}
      updateEntity={updateMachineModel}
      deleteEntity={deleteMachineModel}
      createEntity={createMachineModel}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
    />
  );
};

export default MachineModelsManagement;