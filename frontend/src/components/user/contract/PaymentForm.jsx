import React from 'react';
import { FaLock } from 'react-icons/fa';
import './styles/PaymentForm.css';

const PaymentForm = ({ onSubmit, loading }) => {
  return (
    <form className="contract-form" onSubmit={onSubmit}>
      <button
        className="contract-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Procesando...' : (
          <>
            <FaLock style={{ marginRight: '10px' }} />
            Continuar al Pago Seguro
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;