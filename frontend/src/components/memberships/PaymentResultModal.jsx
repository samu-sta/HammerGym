import React from 'react';
import Modal from '../common/Modal';
import { FaCheckCircle, FaTimesCircle, FaCreditCard, FaFileContract } from 'react-icons/fa';
import './styles/PaymentResultModal.css';

const PaymentResultModal = ({ isOpen, onClose, isSuccess, isRenewal = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuccess ? "Pago Exitoso" : "Pago Cancelado"}
    >
      <article className="payment-result-modal">
        <figure className={`payment-result-icon ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? <FaCheckCircle size={60} /> : <FaTimesCircle size={60} />}
        </figure>

        <h3 className="payment-result-title">
          {isSuccess
            ? isRenewal
              ? "¡Tu contrato ha sido renovado con éxito!"
              : "¡Tu pago ha sido procesado con éxito!"
            : "El proceso de pago ha sido cancelado"}
        </h3>

        <p className="payment-result-message">
          {isSuccess
            ? isRenewal
              ? "Tu contrato de membresía ha sido renovado correctamente. Puedes ver los detalles actualizados en la sección Mis Contratos."
              : "Tu contrato de membresía ha sido creado correctamente. Puedes ver los detalles en la sección Mis Contratos."
            : "No se ha completado el pago. Si experimentaste algún problema, por favor intenta nuevamente o contacta con soporte."}
        </p>

        <footer className="payment-result-actions">
          <button
            className={`action-button ${isSuccess ? 'success-button' : 'primary-button'}`}
            onClick={onClose}
          >
            {isSuccess ? (
              <>
                <FaFileContract className="button-icon" />
                <span>Ver mis contratos</span>
              </>
            ) : (
              <>
                <FaCreditCard className="button-icon" />
                <span>Entendido</span>
              </>
            )}
          </button>
        </footer>
      </article>
    </Modal>
  );
};

export default PaymentResultModal;