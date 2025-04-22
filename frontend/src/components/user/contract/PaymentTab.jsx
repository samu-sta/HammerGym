import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import PaymentSummary from './PaymentSummary';
import PaymentInfo from './PaymentInfo';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import './styles/PaymentTab.css';

const PaymentTab = ({ membership, onSubmit, loading, success, error }) => {
  if (!membership) return null;

  return (
    <article className="contract-payment-card">
      <header className="contract-payment-header">
        <h2 className="contract-payment-title">
          <FaCreditCard /> Finalizar Compra
        </h2>
      </header>

      <PaymentStatus success={success} error={error} />
      <PaymentSummary membership={membership} />
      <PaymentInfo />
      <PaymentForm onSubmit={onSubmit} loading={loading} />
    </article>
  );
};

export default PaymentTab;