import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMonths } from 'date-fns';
import { useAccount } from '../context/AccountContext';
import MembershipList from '../components/memberships/MembershipList';
import UserContractsList from '../components/memberships/UserContractsList';
import { createContract } from '../services/MembershipService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './styles/ContractPage.css';

const ContractPage = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('memberships');

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

  const handleMembershipSelect = (membership) => {
    setSelectedMembership(membership);
    setActiveTab('payment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMembership) {
      setError('Por favor, selecciona una membresía');
      return;
    }

    if (paymentMethod === 'credit_card') {
      // Simple validation
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Por favor, completa todos los campos de pago');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate expiration date (3 months from now as default)
      const expirationDate = addMonths(new Date(), 3).toISOString();

      // Create the contract
      await createContract({
        userId: account.id,
        membershipId: selectedMembership.id,
        expirationDate
      });

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

      <ul className="custom-tabs">
        <li className={`custom-tab ${activeTab === 'contracts' ? 'custom-tab-active' : ''}`}>
          <a className="custom-tab-link" onClick={() => setActiveTab('contracts')}>
            Mis Contratos
          </a>
        </li>
        <li className={`custom-tab ${activeTab === 'memberships' ? 'custom-tab-active' : ''}`}>
          <a className="custom-tab-link" onClick={() => setActiveTab('memberships')}>
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
            <UserContractsList userId={account?.id} />
          </div>

          {activeTab === 'contracts' && (
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
                  <p><strong>Total:</strong> ${selectedMembership.price * 3}</p>
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
                    {loading ? 'Procesando...' : 'Realizar Pago'}
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