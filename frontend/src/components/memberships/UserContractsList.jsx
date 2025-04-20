import React, { useState, useEffect } from 'react';
import UserContract from './UserContract';
import LoadingSpinner from '../common/LoadingSpinner';
import './styles/UserContractsList.css';
import { getUserContracts } from '../../services/MembershipService';

const UserContractsList = ({ onRenewContract }) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        console.log("Fetching from:", `http://localhost:3000/contracts/my-contracts`);
        const data = await getUserContracts();
        console.log("Contract data:", data);
        setContract(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contract:', err);
        setError(`Error al cargar el contrato: ${err.message}`);
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="contracts-alert alert-danger">{error}</div>;
  }

  if (!contract) {
    return <div className="contracts-alert alert-info">No tienes contrato actualmente. Selecciona una membresía para comenzar.</div>;
  }

  return (
    <div className="contracts-container">
      <div className="contracts-section">
        <div className="contracts-row">
          <div className="contract-column">
            <UserContract
              contract={contract}
              onRenewClick={onRenewContract}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContractsList;