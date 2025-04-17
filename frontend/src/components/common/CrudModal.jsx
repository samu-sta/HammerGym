import { FaTimes } from 'react-icons/fa';
import './styles/CrudModal.css';
import FormField from './FormField';
import useCrudForm from '../../hooks/useCrudForm';

/**
 * Componente modal para operaciones CRUD genéricas
 */
const CrudModal = ({
  isOpen,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
  isSubmitting
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useCrudForm(initialValues, fields, onSubmit, isOpen);

  if (!isOpen) return null;

  return (
    <aside className="crud-modal-overlay">
      <section className="crud-modal">
        <header className="crud-modal-header">
          <h2>{title}</h2>
          <button
            className="crud-modal-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="crud-modal-form">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          ))}

          <footer className="crud-modal-actions">
            <button
              type="button"
              className="crud-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="crud-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </footer>
        </form>
      </section>
    </aside>
  );
};

export default CrudModal;