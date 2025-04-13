import { useState } from 'react';
import TrainerClassesList from './components/TrainerClassesList';
import useTrainerClasses from '../../../hooks/useTrainerClasses';
import useModal from '../../../hooks/useModal';
import Modal from '../../common/Modal';
import CreateClassForm from './components/CreateClassForm';
import { FaPlus } from 'react-icons/fa';
import './styles/TrainerClassesSection.css';

const TrainerClassesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, openModal, closeModal } = useModal();
  const {
    classes,
    loading,
    error,
    refetch
  } = useTrainerClasses();

  const handleCreateClassSuccess = () => {
    setTimeout(() => {
      refetch();
      closeModal();
    }, 1500);
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="classes-container">
      <header className="classes-header">
        <input
          type="text"
          placeholder="Buscar clases por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button
          className="create-class-btn"
          onClick={openModal}
        >
          <FaPlus /> Crear Clase
        </button>
      </header>

      <TrainerClassesList
        classes={filteredClasses}
        loading={loading}
        error={error}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Crear Nueva Clase"
      >
        <CreateClassForm
          onSuccess={handleCreateClassSuccess}
          onClose={closeModal}
        />
      </Modal>
    </section>
  );
};

export default TrainerClassesSection;