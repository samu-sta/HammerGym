import React from 'react';
import UserContractsTab from './UserContractsTab';
import MembershipsTab from './MembershipsTab';
import PaymentTab from './PaymentTab';
import './styles/ContractTabsContainer.css';

const ContractTabsContainer = ({
  activeTab,
  hasActiveContract,
  onRenewContract,
  onNewMembership,
  selectedMembership,
  onMembershipSelect,
  handleSubmit,
  loading,
  success,
  error
}) => {
  return (
    <section className="contract-tab-content">
      {/* Tab Contratos */}
      {activeTab === 'contracts' && (
        <UserContractsTab
          hasActiveContract={hasActiveContract}
          onRenewContract={onRenewContract}
          onNewMembership={onNewMembership}
        />
      )}

      {/* Tab Membresías */}
      {activeTab === 'memberships' && (
        <MembershipsTab
          onMembershipSelect={onMembershipSelect}
          selectedMembershipId={selectedMembership?.id}
        />
      )}

      {/* Tab Pago */}
      {activeTab === 'payment' && selectedMembership && (
        <PaymentTab
          membership={selectedMembership}
          onSubmit={handleSubmit}
          loading={loading}
          success={success}
          error={error}
        />
      )}
    </section>
  );
};

export default ContractTabsContainer;