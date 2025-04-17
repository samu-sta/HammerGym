import { useState, useEffect } from 'react';

/**
 * Custom hook para manejar formularios en modales CRUD
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Array} fields - Campos del formulario con sus configuraciones
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} isOpen - Estado del modal (abierto/cerrado)
 * @returns {Object} - Estado y métodos para manejar el formulario
 */
const useCrudForm = (initialValues = {}, fields = [], onSubmit, isOpen) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues || {});
      setErrors({});
    }
  }, [isOpen, initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const typeHandlers = {
      'number': () => Number(value),
      'checkbox': () => checked,
      'default': () => value
    };

    const finalValue = (typeHandlers[type] || typeHandlers['default'])();

    setFormData({
      ...formData,
      [name]: finalValue
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `Este campo es obligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    validateForm
  };
};

export default useCrudForm;