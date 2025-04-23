import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import {
  getAllExercises,
  updateExercise,
  deleteExercise,
  createExercise
} from '../services/ExerciseService';

const ExercisesManagement = () => {
  // Función para transformar ejercicio para la edición
  const transformEntityForEdit = (exercise) => {
    return Object.fromEntries(
      Object.entries(exercise)
        .filter(([_, value]) => typeof value !== 'object' || value === null)
        .map(([key, value]) => {
          // Preservar valores numéricos (incluyendo 0) y otros tipos de valores
          if (value === 0 || typeof value === 'number' || typeof value === 'boolean') {
            return [key, value];
          }
          return [key, value || ''];
        })
    );
  };

  // Campos personalizados para el formulario de ejercicios
  const customFields = [
    {
      name: 'name',
      label: 'Nombre del Ejercicio',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true
    },
    {
      name: 'muscles',
      label: 'Grupo Muscular',
      type: 'select',
      options: [
        { value: 'biceps', label: 'Bíceps' },
        { value: 'triceps', label: 'Tríceps' },
        { value: 'back', label: 'Espalda' },
        { value: 'chest', label: 'Pecho' },
        { value: 'shoulders', label: 'Hombros' },
        { value: 'legs', label: 'Piernas' }
      ],
      required: true
    }
  ];

  return (
    <EntityManagement
      title="Ejercicios"
      entityType="exercises"
      fetchEntities={getAllExercises}
      updateEntity={updateExercise}
      deleteEntity={deleteExercise}
      createEntity={createExercise}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
      customFields={customFields}
      mobileBreakpoint={640} // Ajustar según necesidades de diseño
    />
  );
};

export default ExercisesManagement;