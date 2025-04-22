import React, { useState, useEffect } from 'react';
import EntityManagement from '../components/common/EntityManagement';
import { 
  fetchAllMembershipFeatures, 
  createMembershipFeature, 
  updateMembershipFeature, 
  deleteMembershipFeature 
} from '../services/MembershipFeatureService';
import { fetchAllMemberships } from '../services/MembershipService';

const MembershipFeaturesManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de membresías para el selector
  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const response = await fetchAllMemberships();
        // Transformar datos de membresías para el selector
        const membershipsData = response.map(membership => ({
          value: membership.id,
          label: `${membership.type} - $${membership.price}`
        }));
        setMemberships(membershipsData);
      } catch (error) {
        console.error('Error al cargar membresías:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMemberships();
  }, []);

  // Transformar característica de membresía para la edición
  const transformEntityForEdit = (membershipFeature) => {
    return {
      ...membershipFeature,
      // No necesitamos transformación adicional ya que no hay fechas ni tipos complejos
      membershipId: membershipFeature.membershipId
    };
  };

  // Campos personalizados para el formulario de características de membresía
  const customFields = [
    {
      name: 'membershipId',
      label: 'Membresía',
      type: 'select',
      options: memberships,
      required: true
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      required: true
    }
  ];

  // Función para obtener características de membresías y formatear los datos para la tabla
  const fetchMembershipFeaturesWrapper = async () => {
    try {
      const response = await fetchAllMembershipFeatures();

      return {
        entities: response,
        headers: [
          { key: 'id', label: 'ID', type: 'number' },
          {
            key: 'membershipType',
            label: 'Tipo de Membresía',
            type: 'string',
            formatter: (row) => {
              // Buscar el tipo de membresía correspondiente al ID
              const membershipOption = memberships.find(m => m.value === row.membershipId);
              return membershipOption ? membershipOption.label : 'N/A';
            }
          },
          { key: 'description', label: 'Descripción', type: 'string' },
          {
            key: 'createdAt',
            label: 'Fecha de Creación',
            type: 'date',
            formatter: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching membership features:', error);
      throw error;
    }
  };

  return (
    <EntityManagement
      title="Características de Membresías"
      entityType="membership-features"
      fetchEntities={fetchMembershipFeaturesWrapper}
      updateEntity={updateMembershipFeature}
      deleteEntity={deleteMembershipFeature}
      createEntity={createMembershipFeature}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
      customFields={customFields}
      mobileBreakpoint={900} // Ajustar según necesidades de diseño
    />
  );
};

export default MembershipFeaturesManagement;