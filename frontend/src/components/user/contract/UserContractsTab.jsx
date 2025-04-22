import React from 'react';
import UserContractsList from '../memberships/UserContractsList';
import './styles/UserContractsTab.css';

const UserContractsTab = ({ hasActiveContract, onRenewContract, onNewMembership }) => {
  return (
    <article className="contract-article">
      <UserContractsList onRenewContract={onRenewContract} />

      {!hasActiveContract && (
        <button
          className="contract-btn-primary"
          onClick={onNewMembership}
        >
          Adquirir Nueva Membresía
        </button>
      )}
    </article>
  );
};

export default UserContractsTab;