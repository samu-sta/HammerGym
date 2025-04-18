import React, { useState, useEffect } from 'react';
import MembershipCard from './MembershipCard';
import { fetchAllMemberships } from '../../services/MembershipService';
import LoadingSpinner from '../common/LoadingSpinner';
import './styles/MembershipList.css';

const MembershipList = ({ onMembershipSelect, selectedMembershipId }) => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMemberships = async () => {
      try {
        setLoading(true);
        const membershipsData = await fetchAllMemberships();
        setMemberships(membershipsData);
      } catch (err) {
        setError('Error al cargar las membresías. Por favor, intenta de nuevo más tarde.');
        console.error('Error fetching memberships:', err);
      } finally {
        setLoading(false);
      }
    };

    getMemberships();
  }, []);

  const handleSelect = (membership) => {
    onMembershipSelect(membership);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="memberships-alert alert-danger">{error}</div>;
  }

  if (memberships.length === 0) {
    return <div className="memberships-alert alert-info">No hay membresías disponibles en este momento.</div>;
  }

  return (
    <div className="memberships-container">
      <div className="memberships-row">
        {memberships.map((membership) => (
          <div key={membership.id} className="membership-column">
            <MembershipCard
              membership={membership}
              onSelect={handleSelect}
              isSelected={membership.id === selectedMembershipId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipList;