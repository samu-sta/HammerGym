import { useState, useEffect, useCallback } from 'react';
import { generateTableHeaders, generateFormFields, generateFormFieldsFromHeaders } from '../utils/tableFormUtils';

const useEntityManagement = ({
  entityName,
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
      const data = await fetchEntities();
      setEntities(data);

      if (!data || data.length === 0) return;

      const headers = generateTableHeaders(data);
      setTableHeaders(headers);
      setFormFields(generateFormFields(data, null));
    }
    catch (err) {
      setError(`Error al cargar los ${entityName.toLowerCase()}. Por favor, intenta de nuevo.`);
    }
    finally {
      setIsLoading(false);
    }
  }, [fetchEntities, entityName]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleCreate = useCallback(() => {
    if (entities.length > 0) {
      // Create an empty entity that preserves the original data types
      const emptyEntity = Object.fromEntries(
        Object.keys(entities[0])
          .filter(key => typeof entities[0][key] !== 'object' || entities[0][key] === null)
          .map(key => {
            // Preserve the original data type
            const originalValue = entities[0][key];
            if (typeof originalValue === 'number') return [key, 0];
            if (typeof originalValue === 'boolean') return [key, false];
            return [key, ''];
          })
      );

      setFormFields(generateFormFieldsFromHeaders(tableHeaders, emptyEntity));
      setCurrentEntity(null);
      setIsCreating(true);
      setIsModalOpen(true);
    }
  }, [entities, tableHeaders]);

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
    try {
      await deleteEntity(entity.id);
      loadEntities();
    }
    catch (err) {
      setError(`Error al eliminar el ${entityName.toLowerCase()}. Por favor, intenta de nuevo.`);
    }
  }, [deleteEntity, loadEntities, entityName]);

  const handleUpdate = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      if (isCreating) {
        if (createEntity) {
          await createEntity(formData);
        }
      } else {
        await updateEntity(currentEntity.id, formData);
      }
      setIsModalOpen(false);
      loadEntities();
    }
    catch (err) {
      const action = isCreating ? 'crear' : 'guardar los datos de';
      setError(`Error al ${action} el ${entityName.toLowerCase()}. Por favor, intenta de nuevo.`);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [updateEntity, createEntity, loadEntities, currentEntity, entityName, isCreating]);

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