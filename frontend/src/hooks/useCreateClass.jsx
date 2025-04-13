import { useState } from 'react';
import { createClass } from '../services/classService';
import { validateCreateClass } from '../schemas/class';

/**
 * Hook personalizado para manejar la creación de clases
 */
const useCreateClass = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Procesa los datos del formulario y convierte las fechas a formato ISO
   */
  const processFormData = (formData) => {
    const processedFormData = new FormData();
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');

    for (let [key, value] of formData.entries()) {
      if (key !== 'startDate' && key !== 'endDate') {
        processedFormData.append(key, value);
      }
    }

    // Añadir fechas formateadas
    if (startDate) {
      processedFormData.append('startDate', new Date(startDate).toISOString());
    }

    if (endDate) {
      processedFormData.append('endDate', new Date(endDate).toISOString());
    }

    return processedFormData;
  };

  /**
   * Extrae y formatea los errores de validación
   */
  const formatValidationErrors = (validationError) => {
    const formattedErrors = {};
    const formattedError = validationError.format();

    for (const [key, value] of Object.entries(formattedError)) {
      if (key === '_errors') continue;

      if (typeof value === 'object' && value._errors?.length) {
        formattedErrors[key] = value._errors[0];
      }

      if (key === 'schedule') {
        for (const [scheduleKey, scheduleValue] of Object.entries(value)) {
          if (scheduleKey !== '_errors' && typeof scheduleValue === 'object' && scheduleValue._errors?.length) {
            formattedErrors[`schedule.${scheduleKey}`] = scheduleValue._errors[0];
          }
        }
      }
    }

    return formattedErrors;
  };

  /**
   * Maneja la creación de una nueva clase
   */
  const handleCreateClass = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      const formData = new FormData(event.target);
      const processedFormData = processFormData(formData);

      const validationResult = validateCreateClass(processedFormData);

      if (!validationResult.success) {
        const errors = formatValidationErrors(validationResult.error);
        setFieldErrors(errors);
        return;
      }

      const classData = validationResult.data;
      const response = await createClass(classData);

      if (!response.success) {
        setError(response.message || 'Error al crear la clase');
        return;
      }
      setSuccess(true);
      onSuccess();

    }
    catch (err) {
      setError(err.message || 'Ha ocurrido un error al crear la clase');
    }
    finally {
      setLoading(false);
    }
  };

  return {
    createClass: handleCreateClass,
    loading,
    error,
    success,
    fieldErrors,
    setError,
    setSuccess,
    setFieldErrors
  };
};

export default useCreateClass;