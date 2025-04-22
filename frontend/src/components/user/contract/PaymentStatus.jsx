import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './styles/PaymentStatus.css';

const PaymentStatus = ({ success, error }) => {
  if (!success && !error) return null;

  return (
    <aside className="contract-payment-status">
      {success && (
        <p className="contract-success-message">
          <FaCheckCircle size={20} /> ¡Pago realizado con éxito! Tu contrato ha sido creado.
        </p>
      )}

      {error && (
        <p className="contract-error-message">
          <FaExclamationCircle size={20} /> {error}
        </p>
      )}
    </aside>
  );
};

export default PaymentStatus;