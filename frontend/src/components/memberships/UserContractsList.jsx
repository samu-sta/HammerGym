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
    return <p className="message error-message">{error}</p>;
  }

  if (!contract) {
    return <p className="message info-message">No tienes contrato actualmente. Selecciona una membresía para comenzar.</p>;
  }

  return (
    <section className="contracts-container">
      <UserContract
        contract={contract}
        onRenewClick={onRenewContract}
      />
    </section>
  );
};

export default UserContractsList;