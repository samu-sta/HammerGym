import './styles/EntityManagement.css';
import CrudTable from './CrudTable';
import CrudModal from './CrudModal';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import useEntityManagement from '../../hooks/useEntityManagement';

const EntityManagement = ({
  title,
  entityType = null,
  fetchEntities,
  updateEntity,
  deleteEntity,
  createEntity,
  backPath = '/admin',
  additionalControls,
  transformEntityForEdit,
  mobileBreakpoint = 420, // Parámetro nuevo con valor por defecto de 420
}) => {
  const navigate = useNavigate();

  const {
    entities,
    isLoading,
    error,
    isModalOpen,
    currentEntity,
    isSubmitting,
    tableHeaders,
    formFields,
    isCreating,
    loadEntities,
    handleCreate,
    handleEdit,
    handleDelete,
    handleUpdate,
    closeModal
  } = useEntityManagement({
    entityName: title,
    entityType: entityType,
    fetchEntities,
    updateEntity,
    deleteEntity,
    createEntity,
    transformEntityForEdit
  });

  return (
    <main className="entity-management">
      <header className="entity-management-header">
        <button
          className="button entity-management-back-button"
          onClick={() => navigate(backPath)}
        >
          <FaLongArrowAltLeft /> volver
        </button>
        {additionalControls && additionalControls}
        {createEntity && (
          <button
            className="entity-management-create-button"
            onClick={handleCreate}
            disabled={isLoading || tableHeaders.length === 0}
          >
            <FaPlus /> Nuevo {title.slice(0, -1)}
          </button>
        )}
      </header>

      <section>
        <CrudTable
          title={title}
          headers={tableHeaders}
          data={entities}
          onRefresh={loadEntities}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error}
          mobileBreakpoint={mobileBreakpoint}
        />
      </section>

      <CrudModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isCreating ? `Crear ${title.slice(0, -1)}` : `Editar ${title.slice(0, -1)}`}
        fields={formFields}
        initialValues={currentEntity}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default EntityManagement;