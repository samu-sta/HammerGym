import React, { useState, useEffect } from 'react';
import UserContract from './UserContract';
import LoadingSpinner from '../common/LoadingSpinner';
import './styles/UserContractsList.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const UserContractsList = () => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        console.log("Fetching from:", `http://localhost:3000/contracts/my-contracts`);
        const response = await fetch(`http://localhost:3000/contracts/my-contracts`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON. Received content type: " + contentType);
        }

        const data = await response.json();
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
            <UserContract contract={contract} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContractsList;