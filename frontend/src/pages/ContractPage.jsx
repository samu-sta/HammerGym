import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';
import ContractHeader from '../components/memberships/contract/ContractHeader';
import ContractNavigation from '../components/memberships/contract/ContractNavigation';
import ContractTabsContainer from '../components/memberships/contract/ContractTabsContainer';
import PaymentResultModal from '../components/memberships/PaymentResultModal';
import {
  createStripeCheckoutSession,
  processStripeRedirect,
  getUserContracts,
  createRenewalStripeCheckoutSession
} from '../services/MembershipService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../components/memberships/contract/styles/ContractPage.css';

const ContractPage = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('contracts');
  const [processingRedirect, setProcessingRedirect] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [contractId, setContractId] = useState(null);

  // Manejar redirección de Stripe al cargar la página
  useEffect(() => {
    if (!account) return;

    const query = new URLSearchParams(location.search);
    if ((query.get('success') || query.get('canceled')) && !processingRedirect) {
      setProcessingRedirect(true);
      // Verificar si hay un parámetro renewal=true en la URL
      setIsRenewal(query.get('renewal') === 'true');
      // Guardar el ID del contrato si existe en la URL
      if (query.get('contract_id')) {
        setContractId(query.get('contract_id'));
      }
      handleStripeRedirect(query);
    }
  }, [location, account, processingRedirect]);

  // Verificar si el usuario ya tiene un contrato activo
  useEffect(() => {
    const checkActiveContract = async () => {
      try {
        const contract = await getUserContracts();
        setHasActiveContract(!!contract); // If contract is non-null, user has an active contract
        setCurrentContract(contract);
      } catch (err) {
        console.error('Error comprobando contrato activo:', err);
      }
    };

    if (account) {
      checkActiveContract();
    }
  }, [account, success]);

  // Redirección a login si no hay cuenta
  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

  // Handle Stripe redirect after payment
  const handleStripeRedirect = async (query) => {
    if (!account) return;

    try {
      setLoading(true);
      setError(null);
      const queryParams = {};

      // Convertir los parámetros de la URL a un objeto
      for (const [key, value] of query.entries()) {
        queryParams[key] = value;
      }

      const isSuccess = query.get('success') === 'true';
      setPaymentSuccess(isSuccess);

      if (isSuccess) {
        const result = await processStripeRedirect(queryParams);

        if (result.success) {
          // Mostrar modal de éxito en vez de redireccionar
          setShowPaymentModal(true);
          // Limpiar los parámetros de la URL manteniendo la misma ruta
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setError(result.message || 'Error al procesar el pago.');
          setShowPaymentModal(true);
        }
      } else {
        // Mostrar modal de cancelación
        setShowPaymentModal(true);
        // Limpiar los parámetros de la URL manteniendo la misma ruta
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      setError('Error al procesar la redirección de pago.');
      console.error('Error processing Stripe redirect:', err);
      setShowPaymentModal(true);
    } finally {
      setLoading(false);
      setProcessingRedirect(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setActiveTab('contracts'); // Volver a la pestaña de contratos al cerrar el modal
    // Clean URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleMembershipSelect = (membership) => {
    setSelectedMembership(membership);
    setActiveTab('payment');
  };

  const handleRenewalContract = async (contract) => {
    if (!contract || !contract.id) {
      setError('Información del contrato no disponible');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Guardar referencia al contrato actual para usarlo en el pago
      setCurrentContract(contract);
      setIsRenewal(true);

      const response = await createRenewalStripeCheckoutSession(contract.id);

      if (response.success && response.url) {
        // Redireccionar al usuario a la página de pago de Stripe
        window.location.href = response.url;
      } else {
        setError(response.message || 'Error al crear la sesión de renovación de pago con Stripe.');
      }
    } catch (err) {
      setError('Error al conectar con el servicio de pago para la renovación: ' + (err.message || ''));
      console.error('Error creating renewal Stripe session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMembership) {
      setError('Por favor, selecciona una membresía');
      return;
    }

    handleStripeCheckout();
  };

  const handleStripeCheckout = async () => {
    if (!selectedMembership) {
      setError('Por favor, selecciona una membresía');
      return;
    }

    if (!account) {
      setError('No hay información de usuario disponible, por favor inicia sesión nuevamente');
      navigate('/login');
      return;
    }

    // Verificar que selectedMembership.id existe
    if (!selectedMembership.id) {
      setError('ID de membresía no disponible');
      console.error('selectedMembership:', selectedMembership);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Enviando datos a Stripe checkout:', {
        membershipId: selectedMembership.id
      });

      const response = await createStripeCheckoutSession(
        parseInt(selectedMembership.id)
      );

      if (response.success && response.url) {
        // Redireccionar al usuario a la página de pago de Stripe
        window.location.href = response.url;
      } else {
        setError(response.message || 'Error al crear la sesión de pago con Stripe.');
      }
    } catch (err) {
      setError('Error al conectar con el servicio de pago: ' + (err.message || ''));
      console.error('Error creating Stripe session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/usuario');
  };

  const handleNewMembership = () => {
    setActiveTab('memberships');
  };

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