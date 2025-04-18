import React, { useState, useEffect } from 'react';
import UserContract from './UserContract';
import { getUserContracts } from '../../services/MembershipService';
import LoadingSpinner from '../common/LoadingSpinner';
import './styles/UserContractsList.css';

const UserContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const userContracts = await getUserContracts();
        setContracts(userContracts);
      } catch (err) {
        setError('Error al cargar los contratos. Por favor, intenta de nuevo más tarde.');
        console.error('Error fetching contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="contracts-alert alert-danger">{error}</div>;
  }

  if (contracts.length === 0) {
    return <div className="contracts-alert alert-info">No tienes contratos actualmente. Selecciona una membresía para comenzar.</div>;
  }

  // Sort contracts by creation date (newest first)
  const sortedContracts = [...contracts].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Separate active and expired contracts
  const now = new Date();
  const activeContracts = sortedContracts.filter(
    contract => new Date(contract.expirationDate) > now
  );
  const expiredContracts = sortedContracts.filter(
    contract => new Date(contract.expirationDate) <= now
  );

  return (
    <div className="contracts-container">
      {activeContracts.length > 0 && (
        <div className="contracts-section">
          <h4 className="contracts-section-title">Contratos activos</h4>
          <div className="contracts-row">
            {activeContracts.map(contract => (
              <div key={contract.id} className="contract-column">
                <UserContract contract={contract} />
              </div>
            ))}
          </div>
        </div>
      )}

      {expiredContracts.length > 0 && (
        <div className="contracts-section">
          <h4 className="contracts-section-title">Contratos expirados</h4>
          <div className="contracts-row">
            {expiredContracts.map(contract => (
              <div key={contract.id} className="contract-column">
                <UserContract contract={contract} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContractsList;