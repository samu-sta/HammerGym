import React from 'react';
import './styles/FormField.css';

/**
 * Componente que renderiza diferentes tipos de campos de formulario
 * 
 * @param {Object} field - Configuración del campo
 * @param {Object} formData - Datos actuales del formulario
 * @param {Object} errors - Errores de validación
 * @param {Function} handleChange - Manejador de cambios en los campos
 * @returns {JSX.Element} - El campo de formulario renderizado
 */
const FormField = ({ field, formData, errors, handleChange }) => {
  const { name, label, type = 'text', options, placeholder, required } = field;

  const renderFieldInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={errors[name] ? 'crud-modal-input-error' : ''}
          >
            <option value="">Seleccionar...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={formData[name] || ''}
            placeholder={placeholder || ''}
            onChange={handleChange}
            className={errors[name] ? 'crud-modal-input-error' : ''}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={name}
            checked={formData[name] || false}
            onChange={handleChange}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            placeholder={placeholder || ''}
            onChange={handleChange}
            className={errors[name] ? 'crud-modal-input-error' : ''}
          />
        );
    }
  };

  return (
    <fieldset className="crud-modal-field">
      <label>
        {label}
        {required && <span className="crud-modal-required">*</span>}
      </label>
      {renderFieldInput()}
      {errors[name] && (
        <p className="crud-modal-error">{errors[name]}</p>
      )}
    </fieldset>
  );
};

export default FormField;