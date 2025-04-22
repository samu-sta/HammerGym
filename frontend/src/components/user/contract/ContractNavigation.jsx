import React from 'react';
import './styles/ContractNavigation.css';

const ContractNavigation = ({
  activeTab,
  setActiveTab,
  hasActiveContract,
  hasSelectedMembership
}) => {
  return (
    <nav className="contract-nav">
      <button
        className={`contract-nav-button ${activeTab === 'contracts' ? 'active' : ''}`}
        onClick={() => setActiveTab('contracts')}
      >
        Mis Contratos
      </button>
      <button
        className={`contract-nav-button ${activeTab === 'memberships' ? 'active' : ''}`}
        disabled={hasActiveContract}
        onClick={() => !hasActiveContract && setActiveTab('memberships')}
        title={hasActiveContract ? 'Ya tienes un contrato activo' : 'Adquirir nueva membresía'}
      >
        Membresías Disponibles
      </button>
      <button
        className={`contract-nav-button ${activeTab === 'payment' ? 'active' : ''}`}
        disabled={!hasSelectedMembership}
        onClick={() => hasSelectedMembership && setActiveTab('payment')}
      >
        Pago
      </button>
    </nav>
  );
};

export default ContractNavigation;