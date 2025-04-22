import React from 'react';
import { useAccount } from '../context/AccountContext';
import ContractHeader from '../components/user/contract/ContractHeader';
import ContractNavigation from '../components/user/contract/ContractNavigation';
import ContractTabsContainer from '../components/user/contract/ContractTabsContainer';
import PaymentResultModal from '../components/user/memberships/PaymentResultModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useContract from '../hooks/useContract';
import './styles/ContractPage.css';

const ContractPage = () => {
  const { account } = useAccount();
  const {
    // States
    selectedMembership,
    loading,
    error,
    success,
    activeTab,
    showPaymentModal,
    paymentSuccess,
    hasActiveContract,
    isRenewal,
    currentContract,

    // Methods
    setActiveTab,
    closePaymentModal,
    handleMembershipSelect,
    handleRenewalContract,
    handleSubmit,
    handleGoBack,
    handleNewMembership
  } = useContract();

  if (!account) {
    return <LoadingSpinner />;
  }

  return (
    <main className="contract-page-container">
      <ContractHeader onGoBack={handleGoBack} />

      {/* Modal de Resultado de Pago */}
      <PaymentResultModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        isSuccess={paymentSuccess}
        isRenewal={isRenewal}
      />

      <ContractNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveContract={hasActiveContract}
        hasSelectedMembership={!!selectedMembership}
      />

      <ContractTabsContainer
        activeTab={activeTab}
        hasActiveContract={hasActiveContract}
        onRenewContract={handleRenewalContract}
        onNewMembership={handleNewMembership}
        selectedMembership={selectedMembership}
        onMembershipSelect={handleMembershipSelect}
        handleSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
      />
    </main>
  );
};

export default ContractPage;