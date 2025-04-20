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
    return <aside className="contracts-alert alert-danger">{error}</aside>;
  }

  if (!contract) {
    return <aside className="contracts-alert alert-info">No tienes contrato actualmente. Selecciona una membresía para comenzar.</aside>;
  }

  return (
    <section className="contracts-container">
      <article className="contracts-section">
        <section className="contracts-row">
          <article className="contract-column">
            <UserContract
              contract={contract}
              onRenewClick={onRenewContract}
            />
          </article>
        </section>
      </article>
    </section>
  );
};

export default UserContractsList;