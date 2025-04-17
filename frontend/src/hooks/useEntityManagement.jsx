import { useState, useEffect, useCallback } from 'react';
import { generateTableHeaders, generateFormFields, generateFormFieldsFromHeaders } from '../utils/tableFormUtils';

const useEntityManagement = ({
  entityName,
  entityType = null,
  fetchEntities,
  updateEntity,
  deleteEntity,
  createEntity,
  transformEntityForEdit,
}) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const loadEntities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchEntities();

      // Handle both legacy and new API response format
      let entitiesData = [];
      let headersData = [];

      if (response.entities !== undefined && response.headers !== undefined) {
        // New API format with explicit entities and headers
        entitiesData = response.entities;
        headersData = response.headers;
      } else {
        // Legacy format - response is the entities array
        entitiesData = response;
        if (entitiesData && entitiesData.length > 0) {
          headersData = generateTableHeaders(entitiesData, entityType);
        }
      }

      setEntities(entitiesData);

      // Use the headers from the backend if available, otherwise generate them
      if (headersData && headersData.length > 0) {
        setTableHeaders(headersData);

        // Generate form fields based on the headers
        const emptyEntity = {};
        if (entitiesData.length > 0) {
          // Use first entity as template for types
          Object.keys(entitiesData[0]).forEach(key => {
            const value = entitiesData[0][key];
            if (typeof value === 'number') emptyEntity[key] = 0;
            else if (typeof value === 'boolean') emptyEntity[key] = false;
            else emptyEntity[key] = '';
          });
        } else {
          // If no entities, create empty entity from headers
          headersData.forEach(header => {
            switch (header.type) {
              case 'number':
                emptyEntity[header.key] = 0;
                break;
              case 'boolean':
                emptyEntity[header.key] = false;
                break;
              default:
                emptyEntity[header.key] = '';
            }
          });
        }

        setFormFields(generateFormFieldsFromHeaders(headersData, emptyEntity));
      }
    }
    catch (err) {
      console.error("Error loading entities:", err);
      setError(`Error al cargar los ${entityName.toLowerCase()}. Por favor, intenta de nuevo.`);
    }
    finally {
      setIsLoading(false);
    }
  }, [fetchEntities, entityName, entityType]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleCreate = useCallback(() => {
    // Create an empty entity that preserves the original data types
    const emptyEntity = {};

    // Use tableHeaders to create the empty entity
    tableHeaders.forEach(header => {
      switch (header.type) {
        case 'number':
          emptyEntity[header.key] = 0;
          break;
        case 'boolean':
          emptyEntity[header.key] = false;
          break;
        default:
          emptyEntity[header.key] = '';
      }
    });

    setFormFields(generateFormFieldsFromHeaders(tableHeaders, emptyEntity));
    setCurrentEntity(null);
    setIsCreating(true);
    setIsModalOpen(true);
  }, [tableHeaders]);

  const handleEdit = useCallback((entity) => {
    const defaultTransform = (entity) => {
      return Object.fromEntries(
        Object.entries(entity)
          .map(([key, value]) => [key, value || ''])
      );
    };

    const formattedEntity = transformEntityForEdit
      ? transformEntityForEdit(entity)
      : defaultTransform(entity);

    setFormFields(generateFormFieldsFromHeaders(tableHeaders, formattedEntity));
    setCurrentEntity(formattedEntity);
    setIsCreating(false);
    setIsModalOpen(true);
  }, [tableHeaders, transformEntityForEdit]);

  const handleDelete = useCallback(async (entity) => {
    // Removing the window.confirm alert to only use the modal confirmation
    setIsLoading(true);
    setError(null);

    try {
      await deleteEntity(entity.id);
      loadEntities();
    }
    catch (err) {
      console.error(`Error deleting ${entityName.slice(0, -1)}:`, err);
      setError(`Error al eliminar el ${entityName.slice(0, -1).toLowerCase()}. Por favor, intenta de nuevo.`);
      setIsLoading(false);
    }
  }, [deleteEntity, entityName, loadEntities]);

  const handleUpdate = useCallback(async (formData) => {
    setIsSubmitting(true);

    try {
      if (isCreating) {
        await createEntity(formData);
      } else {
        await updateEntity(currentEntity.id, formData);
      }

      await loadEntities();
      setIsModalOpen(false);
    }
    catch (err) {
      console.error(`Error ${isCreating ? 'creating' : 'updating'} ${entityName.slice(0, -1)}:`, err);
      alert(`Error al ${isCreating ? 'crear' : 'actualizar'} el ${entityName.slice(0, -1).toLowerCase()}. Por favor, intenta de nuevo.`);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [createEntity, updateEntity, currentEntity, entityName, isCreating, loadEntities]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    // Estados
    entities,
    isLoading,
    error,
    isModalOpen,
    currentEntity,
    isSubmitting,
    tableHeaders,
    formFields,
    isCreating,

    // Acciones
    loadEntities,
    handleCreate,
    handleEdit,
    handleDelete,
    handleUpdate,
    closeModal,

    // Setters
    setIsModalOpen
  };
};

export default useEntityManagement;