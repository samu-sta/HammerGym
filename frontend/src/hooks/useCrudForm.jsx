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

  // Reset form when modal opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues || {});
      setErrors({});
    }
  }, [isOpen, initialValues]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear validation error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form fields
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

  // Handle form submission
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