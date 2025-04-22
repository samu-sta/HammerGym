import React, { useState, useEffect } from 'react';
import EntityManagement from '../components/common/EntityManagement';
import { fetchAllContracts, updateContract, deleteContract, createContract } from '../services/ContractService';
import { fetchAllMemberships } from '../services/MembershipService';
import { API_URL } from '../config/constants';

const ContractsManagement = () => {
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

  // Transformar contrato para la edición
  const transformEntityForEdit = (contract) => {
    // Extraer el nombre de usuario si existe en el objeto anidado
    let username = '';
    if (contract.user && contract.user.account) {
      username = contract.user.account.username;
    }

    return {
      ...Object.fromEntries(
        Object.entries(contract)
          .filter(([key, _]) =>
            key !== 'user' &&
            key !== 'membership' &&
            key !== 'createdAt' &&
            key !== 'updatedAt'
          )
          .map(([key, value]) => {
            if (key === 'expirationDate' && value) {
              // Formatear fecha para input type="date"
              return [key, new Date(value).toISOString().split('T')[0]];
            }
            if (value === 0 || typeof value === 'number' || typeof value === 'boolean') {
              return [key, value];
            }
            return [key, value || ''];
          })
      ),
      username // Incluir el nombre de usuario extraído
    };
  };

  // Campos personalizados para el formulario de contratos
  const customFields = [
    {
      name: 'username',
      label: 'Nombre de Usuario',
      type: 'text', // Campo de texto simple, no selector
      required: true
    },
    {
      name: 'membershipId',
      label: 'Membresía',
      type: 'select',
      options: memberships,
      required: true
    },
    {
      name: 'expirationDate',
      label: 'Fecha de Expiración',
      type: 'date',
      required: true
    },
    {
      name: 'paymentStatus',
      label: 'Estado de Pago',
      type: 'select',
      options: [
        { value: 'paid', label: 'Pagado' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'failed', label: 'Fallido' }
      ],
      required: true
    },
    {
      name: 'paymentMethod',
      label: 'Método de Pago',
      type: 'text'
    },
    {
      name: 'paymentReference',
      label: 'Referencia de Pago',
      type: 'text'
    }
  ];

  // Función para obtener contratos y formatear los datos para la tabla
  const fetchContractsWrapper = async () => {
    try {
      const response = await fetchAllContracts();

      return {
        entities: response,
        headers: [
          { key: 'id', label: 'ID', type: 'number' },
          {
            key: 'username',
            label: 'Usuario',
            type: 'string',
            formatter: (row) => {
              return row.user.account.username || 'N/A';
            }
          },
          {
            key: 'membershipType',
            label: 'Tipo de Membresía',
            type: 'string',
            formatter: (row) => {
              return row.membership.type || 'N/A';
            }
          },
          {
            key: 'expirationDate',
            label: 'Fecha de Expiración',
            type: 'date',
            formatter: (row) => row.expirationDate ? new Date(row.expirationDate).toLocaleDateString() : 'N/A'
          },
          { key: 'paymentStatus', label: 'Estado de Pago', type: 'string' },
          {
            key: 'createdAt',
            label: 'Fecha de Creación',
            type: 'date',
            formatter: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  };

  return (
    <EntityManagement
      title="Contratos"
      entityType="contracts"
      fetchEntities={fetchContractsWrapper}
      updateEntity={updateContract}
      deleteEntity={deleteContract}
      createEntity={createContract}
      backPath="/admin"
      transformEntityForEdit={transformEntityForEdit}
      customFields={customFields}
      mobileBreakpoint={900} // Ajustar según necesidades de diseño
    />
  );
};

export default ContractsManagement;