import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addMonths } from 'date-fns';
import { useAccount } from '../context/AccountContext';
import { FaLongArrowAltLeft, FaCreditCard, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import MembershipList from '../components/memberships/MembershipList';
import UserContractsList from '../components/memberships/UserContractsList';
import PaymentResultModal from '../components/memberships/PaymentResultModal';
import {
  createStripeCheckoutSession,
  processStripeRedirect,
  getUserContracts,
  createRenewalStripeCheckoutSession
} from '../services/MembershipService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './styles/ContractPage.css';

const ContractPage = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

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

  if (!account) {
    return <LoadingSpinner />;
  }

  return (
    <main className="contract-page-container">
      <header className="contract-header">
        <button className="contract-btn-back" onClick={handleGoBack}>
          <FaLongArrowAltLeft /> Volver
        </button>
        <h1 className="contract-title">Contrato y Membresía</h1>
      </header>

      {/* Modal de Resultado de Pago */}
      <PaymentResultModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        isSuccess={paymentSuccess}
        isRenewal={isRenewal}
      />

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
          disabled={!selectedMembership}
          onClick={() => selectedMembership && setActiveTab('payment')}
        >
          Pago
        </button>
      </nav>

      <section className="contract-tab-content">
        {/* Tab Contratos */}
        {activeTab === 'contracts' && (
          <article className="contract-article">
            <UserContractsList onRenewContract={handleRenewalContract} />

            {!hasActiveContract && (
              <button
                className="contract-btn-primary"
                onClick={() => setActiveTab('memberships')}
              >
                Adquirir Nueva Membresía
              </button>
            )}
          </article>
        )}

        {/* Tab Membresías */}
        {activeTab === 'memberships' && (
          <article className="contract-article">
            <MembershipList
              onMembershipSelect={handleMembershipSelect}
              selectedMembershipId={selectedMembership?.id}
            />
          </article>
        )}

        {/* Tab Pago */}
        {activeTab === 'payment' && selectedMembership && (
          <article className="contract-payment-card">
            <header className="contract-payment-header">
              <h2 className="contract-payment-title">
                <FaCreditCard /> Finalizar Compra
              </h2>
            </header>

            {success && (
              <p className="contract-success-message">
                <FaCheckCircle size={20} /> ¡Pago realizado con éxito! Tu contrato ha sido creado.
              </p>
            )}

            {error && (
              <p className="contract-error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg> {error}
              </p>
            )}

            <section className="contract-payment-summary">
              <h3 className="contract-payment-summary-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                  <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                </svg> Resumen de compra
              </h3>
              <p><strong>Membresía:</strong> <span>{selectedMembership.type}</span></p>
              <p><strong>Precio:</strong> <span>${selectedMembership.price} / mes</span></p>
              <p><strong>Duración:</strong> <span>1 mes</span></p>
              <p><strong>Total:</strong> <span>${parseFloat(selectedMembership.price).toFixed(2)}</span></p>
            </section>

            <form className="contract-form" onSubmit={handleSubmit}>
              <div className="contract-payment-info">
                <div className="contract-payment-text">
                  <h4>
                    <FaShieldAlt /> Información de pago
                  </h4>
                  <p>
                    El pago de tu membresía se procesará de forma segura a través de Stripe.
                    Haz clic en el botón para continuar con el proceso de pago.
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#998000" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    </svg>
                    Tu información de pago está protegida con cifrado de extremo a extremo
                  </p>
                </div>
                <div className="contract-payment-image">
                  <img
                    src="https://stripe.com/img/v3/home/social.png"
                    alt="Stripe secure payment"
                    style={{ maxWidth: '120px' }}
                  />
                </div>
              </div>

              <button
                className="contract-submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Procesando...' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                    Continuar al Pago Seguro
                  </>
                )}
              </button>
            </form>
          </article>
        )}
      </section>
    </main>
  );
};

export default ContractPage;