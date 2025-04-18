import React, { useState, useEffect } from 'react';
import EntityManagement from '../components/common/EntityManagement';
import {
  fetchAllMachines,
  updateMachine,
  deleteMachine,
  createMachine,
  fetchGymLocations,
  fetchMachineModels
} from '../services/MachineService';

const MachinesManagement = () => {
  const [gymLocations, setGymLocations] = useState([]);
  const [machineModels, setMachineModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gymsResponse, modelsResponse] = await Promise.all([
          fetchGymLocations(),
          fetchMachineModels()
        ]);

        // Transformar los datos del gimnasio para obtener solo las ubicaciones
        const locations = gymsResponse.gyms.map(gym => ({
          value: gym.location,
          label: gym.location
        }));

        // Transformar los modelos de máquina para el selector
        const models = modelsResponse.machineModels.map(model => ({
          value: model.id,
          label: model.name
        }));

        setGymLocations(locations);
        setMachineModels(models);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Esta función transforma la entidad para la edición
  const transformEntityForEdit = (machine) => {
    // Filtrar y mapear solo propiedades primitivas (no objetos anidados)
    const simpleProps = Object.fromEntries(
      Object.entries(machine)
        .filter(([key, value]) => typeof value !== 'object' || value === null)
        .map(([key, value]) => {
          // Preservar valores numéricos (incluyendo 0) y otros tipos de valores
          if (value === 0 || typeof value === 'number' || typeof value === 'boolean') {
            return [key, value];
          }
          return [key, value || ''];
        })
    );

    // Añadir la ubicación del gimnasio
    if (machine.gym && machine.gym.location) {
      simpleProps.gymLocation = machine.gym.location;
    }

    return simpleProps;
  };

  // Función para transformar los datos antes de crear/actualizar
  const transformForSubmit = (formData) => {
    // Asegurarse de que machineModelId sea un número
    const transformed = { ...formData };
    if (transformed.machineModelId) {
      transformed.machineModelId = Number(transformed.machineModelId);
    }

    return transformed;
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Crear campos de formulario personalizado
  const customFields = [
    {
      name: 'machineModelId',
      label: 'Modelo de máquina',
      type: 'select',
      options: machineModels,
      required: true
    },
    {
      name: 'gymLocation',
      label: 'Ubicación del gimnasio',
      type: 'select',
      options: gymLocations,
      required: true
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'available', label: 'Disponible' },
        { value: 'broken', label: 'Averiada' },
        { value: 'preparing', label: 'En Preparación' },
        { value: 'outOfService', label: 'Fuera de Servicio' }
      ],
      required: true
    }
  ];

  return (
    <EntityManagement
      title="Máquinas"
      entityType="machines"
      fetchEntities={fetchAllMachines}
      updateEntity={(id, data) => updateMachine(id, transformForSubmit(data))}
      deleteEntity={deleteMachine}
      createEntity={(data) => createMachine(transformForSubmit(data))}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
      customFields={customFields}
      mobileBreakpoint={640} // Ajustar según necesidades
    />
  );
};

export default MachinesManagement;