import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './styles/UserContract.css';
import InfoChip from '../common/InfoChip';
import { FaCheckCircle, FaExclamationCircle, FaCalendarAlt, FaHourglassHalf } from 'react-icons/fa';

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

  const getDaysRemainingColor = () => {
    const days = daysRemaining();
    if (days <= 7) return 'danger';
    if (days <= 14) return 'warning';
    return 'success';
  };

  return (
    <article className="membership-contract">
      <header>
        <h3>{membership?.type || 'Membresía'}</h3>

        <div className="status-chips">
          <InfoChip
            icon={isExpired ? FaExclamationCircle : FaCheckCircle}
            className={isExpired ? 'danger' : 'success'}
          >
            {isExpired ? 'Expirado' : 'Activo'}
          </InfoChip>

          {!isExpired && (
            <InfoChip
              icon={FaHourglassHalf}
              className={getDaysRemainingColor()}
            >
              {daysRemaining()} días restantes
            </InfoChip>
          )}
        </div>
      </header>

      <section className="contract-details">
        <dl>
          <div className="detail-item">
            <dt>Contratación:</dt>
            <dd>{formatDate(createdAtObj)}</dd>
          </div>
          <div className="detail-item">
            <dt>Expiración:</dt>
            <dd>{formatDate(expirationDateObj)}</dd>
          </div>
        </dl>
      </section>

      <footer>
        <button
          onClick={() => onRenewClick && onRenewClick(contract)}
          aria-label="Renovar membresía"
        >
          Renovar
        </button>
      </footer>
    </article>
  );
};

export default UserContract;