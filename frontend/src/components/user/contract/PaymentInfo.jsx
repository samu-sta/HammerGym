import React from 'react';
import { FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import './styles/PaymentInfo.css';

const PaymentInfo = () => {
  return (
    <section className="contract-payment-info">
      <article className="contract-payment-text">
        <h4>
          <FaShieldAlt /> Información de pago
        </h4>
        <p>
          El pago de tu membresía se procesará de forma segura a través de Stripe.
          Haz clic en el botón para continuar con el proceso de pago.
        </p>
        <p className="contract-security-note">
          <FaInfoCircle style={{ marginRight: '6px', color: '#998000' }} />
          Tu información de pago está protegida con cifrado de extremo a extremo
        </p>
      </article>
      <figure className="contract-payment-image">
        <img
          src="/images/stripe.png"
          alt="Stripe secure payment"
          style={{ maxWidth: '120px' }}
        />
      </figure>
    </section>
  );
};

export default PaymentInfo;