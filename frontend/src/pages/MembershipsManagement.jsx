import React from 'react';
import EntityManagement from '../components/common/EntityManagement';
import {
  fetchAllMemberships,
  updateMembership,
  deleteMembership,
  createMembership
} from '../services/MembershipService';

const MembershipsManagement = () => {
  // Función para transformar una entidad de membresía para la edición
  const transformEntityForEdit = (membership) => {
    return Object.fromEntries(
      Object.entries(membership)
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

  // Campos personalizados para el formulario de membresías
  const customFields = [
    {
      name: 'type',
      label: 'Tipo de Membresía',
      type: 'text',
      required: true
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'number',
      required: true
    }
    // Description field removed as it's already defined by features
  ];

  return (
    <EntityManagement
      title="Membresías"
      entityType="memberships"
      fetchEntities={fetchAllMemberships}
      updateEntity={updateMembership}
      deleteEntity={deleteMembership}
      createEntity={createMembership}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
      customFields={customFields}
      mobileBreakpoint={640} // Ajustar según necesidades de diseño
    />
  );
};

export default MembershipsManagement;