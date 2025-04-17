import Modal from './Modal';
import './styles/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este registro?"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <section className="delete-modal-content">
        <p>{message}</p>
        <footer className="delete-modal-actions">
          <button
            className="delete-modal-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="delete-modal-confirm"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </footer>
      </section>
    </Modal>
  );
};

export default DeleteConfirmationModal;