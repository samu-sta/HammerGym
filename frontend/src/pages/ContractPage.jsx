import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addMonths } from 'date-fns';
import { useAccount } from '../context/AccountContext';
import MembershipList from '../components/memberships/MembershipList';
import UserContractsList from '../components/memberships/UserContractsList';
import PaymentResultModal from '../components/memberships/PaymentResultModal';
import {
  createContract,
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
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMembership) {
      setError('Por favor, selecciona una membresía');
      return;
    }

    // Si el método de pago es Stripe Checkout, usar esa opción
    if (paymentMethod === 'stripe_checkout') {
      handleStripeCheckout();
      return;
    }

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      // Simple validation
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Por favor, completa todos los campos de pago');
        return;
      }

      // Parse expiryDate (MM/AA format)
      const [expMonth, expYear] = expiryDate.split('/');
      if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
        setError('Formato de fecha de expiración inválido. Utiliza MM/AA');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate expiration date (3 months from now as default)
      const expirationDate = addMonths(new Date(), 3).toISOString();

      // Format card details for Stripe
      let cardDetails = null;
      if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        const [expMonth, expYear] = expiryDate.split('/');
        cardDetails = {
          number: cardNumber.replace(/\s+/g, ''),
          expMonth: parseInt(expMonth, 10),
          expYear: parseInt('20' + expYear, 10),
          cvc: cvv
        };
      }

      // Create the contract with payment processing
      const result = await createContract({
        membershipId: selectedMembership.id,
        expirationDate,
        paymentMethod,
        cardDetails
      });

      if (result.success) {
        setSuccess(true);
        setSelectedMembership(null);
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');

        // After successful payment, go back to contracts tab
        setTimeout(() => {
          setActiveTab('contracts');
        }, 2000);
      } else {
        setError(result.message || 'Error al procesar el pago.');
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
      console.error('Error creating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return <LoadingSpinner />;
  }

  return (
    <div className="contract-page-container">
      <h1 className="page-title">Contrato y Membresía</h1>

      {/* Modal de Resultado de Pago */}
      <PaymentResultModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        isSuccess={paymentSuccess}
        isRenewal={isRenewal}
      />

      <ul className="custom-tabs">
        <li className={`custom-tab ${activeTab === 'contracts' ? 'custom-tab-active' : ''}`}>
          <a className="custom-tab-link" onClick={() => setActiveTab('contracts')}>
            Mis Contratos
          </a>
        </li>
        <li className={`custom-tab ${activeTab === 'memberships' ? 'custom-tab-active' : ''} ${hasActiveContract ? 'custom-tab-disabled' : ''}`}>
          <a className={`custom-tab-link ${hasActiveContract ? 'disabled' : ''}`}
            onClick={() => !hasActiveContract && setActiveTab('memberships')}
            title={hasActiveContract ? 'Ya tienes un contrato activo' : 'Adquirir nueva membresía'}>
            Membresías Disponibles
          </a>
        </li>
        <li className={`custom-tab ${activeTab === 'payment' ? 'custom-tab-active' : ''} ${!selectedMembership ? 'custom-tab-disabled' : ''}`}>
          <a className="custom-tab-link" onClick={() => selectedMembership && setActiveTab('payment')}>
            Pago
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'contracts' ? 'active' : ''}`}>
          <div className="mb-4">
            <UserContractsList onRenewContract={handleRenewalContract} />
          </div>

          {activeTab === 'contracts' && !hasActiveContract && (
            <div className="center-button-container">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setActiveTab('memberships')}
              >
                Adquirir Nueva Membresía
              </button>
            </div>
          )}
        </div>

        <div className={`tab-pane ${activeTab === 'memberships' ? 'active' : ''}`}>
          <div className="mb-4">
            <MembershipList
              onMembershipSelect={handleMembershipSelect}
              selectedMembershipId={selectedMembership?.id}
            />
          </div>
        </div>

        <div className={`tab-pane ${activeTab === 'payment' ? 'active' : ''}`}>
          {selectedMembership && (
            <div className="payment-card">
              <div className="payment-card-header">
                <h4>Finalizar Compra</h4>
              </div>
              <div className="payment-card-body">
                {success && (
                  <div className="alert alert-success">
                    ¡Pago realizado con éxito! Tu contrato ha sido creado.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <div className="payment-summary">
                  <h5>Resumen de compra:</h5>
                  <p><strong>Membresía:</strong> {selectedMembership.type}</p>
                  <p><strong>Precio:</strong> ${selectedMembership.price} / mes</p>
                  <p><strong>Duración:</strong> 3 meses</p>
                  <p><strong>Total:</strong> ${(selectedMembership.price * 3).toFixed(2)}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Método de pago</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="credit_card">Tarjeta de Crédito</option>
                      <option value="debit_card">Tarjeta de Débito</option>
                      <option value="stripe_checkout">Stripe Checkout (Recomendado)</option>
                    </select>
                  </div>

                  {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Número de tarjeta</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nombre en la tarjeta</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre como aparece en la tarjeta"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-col form-col-half">
                          <div className="form-group">
                            <label className="form-label">Fecha de expiración</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM/AA"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-col form-col-half">
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="XXX"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-success btn-lg btn-block ${loading ? 'btn-disabled' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : paymentMethod === 'stripe_checkout' ? 'Continuar al Pago Seguro' : 'Realizar Pago'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractPage;