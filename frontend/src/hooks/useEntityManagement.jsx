import { useState, useEffect, useCallback } from 'react';
import { generateTableHeaders, generateFormFields, generateFormFieldsFromHeaders } from '../utils/tableFormUtils';

const useEntityManagement = ({
  entityName,
  fetchEntities,
  updateEntity,
  deleteEntity,
  transformEntityForEdit
}) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [formFields, setFormFields] = useState([]);

  const loadEntities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEntities();
      setEntities(data);

      if (!data || data.length === 0) return;

      const headers = generateTableHeaders(data);
      setTableHeaders(headers);
      setFormFields(generateFormFields(data));
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

  const handleEdit = useCallback((entity) => {
    const defaultTransform = (entity) => {
      return Object.fromEntries(
        Object.entries(entity)
          .filter(([_, value]) => typeof value !== 'object' || value === null)
          .map(([key, value]) => [key, value || ''])
      );
    };

    const formattedEntity = transformEntityForEdit
      ? transformEntityForEdit(entity)
      : defaultTransform(entity);

    setFormFields(generateFormFieldsFromHeaders(tableHeaders, formattedEntity));
    setCurrentEntity(formattedEntity);
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
      await updateEntity(currentEntity.id, formData);
      setIsModalOpen(false);
      loadEntities();
    }
    catch (err) {
      setError(`Error al guardar los datos del ${entityName.toLowerCase()}. Por favor, intenta de nuevo.`);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [updateEntity, loadEntities, currentEntity, entityName]);

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

    // Acciones
    loadEntities,
    handleEdit,
    handleDelete,
    handleUpdate,
    closeModal,

    // Setters
    setIsModalOpen
  };
};

export default useEntityManagement;