import './styles/EntityManagement.css';
import CrudTable from './CrudTable';
import CrudModal from './CrudModal';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import useEntityManagement from '../../hooks/useEntityManagement';

const EntityManagement = ({
  title,
  fetchEntities,
  updateEntity,
  deleteEntity,
  backPath = '/admin',
  additionalControls,
  transformEntityForEdit
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
    loadEntities,
    handleEdit,
    handleDelete,
    handleUpdate,
    closeModal
  } = useEntityManagement({
    entityName: title,
    fetchEntities,
    updateEntity,
    deleteEntity,
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
        />
      </section>

      <CrudModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Editar ${title}`}
        fields={formFields}
        initialValues={currentEntity}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default EntityManagement;