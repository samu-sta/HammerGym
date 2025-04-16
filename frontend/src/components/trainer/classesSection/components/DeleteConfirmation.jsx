import React from 'react';
import '../styles/DeleteConfirmation.css';

const DeleteConfirmation = ({ onConfirm, onCancel, loading, error }) => (
  <section className="delete-confirmation">
    <p>¿Estás seguro de eliminar esta clase?</p>
    <footer className="confirmation-buttons">
      <button
        className="confirm-button-delete"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Eliminando...' : 'Confirmar'}
      </button>
      <button
        className="cancel-button"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </button>
    </footer>
    {error && <p className="error-message">{error}</p>}
  </section>
);

export default DeleteConfirmation;