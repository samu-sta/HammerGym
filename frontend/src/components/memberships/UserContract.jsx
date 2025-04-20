import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './styles/UserContract.css';

const UserContract = ({ contract, onRenewClick }) => {
  if (!contract) {
    return null;
  }

  const { id, expirationDate, membership, createdAt } = contract;
  const expirationDateObj = new Date(expirationDate);
  const createdAtObj = new Date(createdAt);
  const isExpired = new Date() > expirationDateObj;

  const formatDate = (date) => {
    return format(date, 'dd MMMM yyyy', { locale: es });
  };

  const daysRemaining = () => {
    const today = new Date();
    const diffTime = expirationDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="contract-card">
      <div className="contract-header">
        <h5>Contrato #{id}</h5>
        <span className={`status-badge ${isExpired ? 'status-expired' : 'status-active'}`}>
          {isExpired ? 'Expirado' : 'Activo'}
        </span>
      </div>
      <div className="contract-body">
        <h3 className="contract-title">{membership?.type || 'Membresía'}</h3>
        <div className="contract-info">
          <strong>Fecha de contratación:</strong> {formatDate(createdAtObj)}
        </div>
        <div className="contract-info">
          <strong>Fecha de expiración:</strong> {formatDate(expirationDateObj)}
        </div>
        {!isExpired && (
          <div className="days-remaining">
            <span className={`days-remaining-badge ${daysRemaining() > 30 ? 'days-normal' : 'days-warning'}`}>
              {daysRemaining()} días restantes
            </span>
          </div>
        )}

        <div className="contract-actions">
          <button
            className="btn btn-primary btn-renew"
            onClick={() => onRenewClick && onRenewClick(contract)}
          >
            Renovar por 1 mes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserContract;