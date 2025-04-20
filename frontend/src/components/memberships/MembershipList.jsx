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
    return <aside className="memberships-alert alert-danger">{error}</aside>;
  }

  if (memberships.length === 0) {
    return <aside className="memberships-alert alert-info">No hay membresías disponibles en este momento.</aside>;
  }

  return (
    <section className="memberships-container">
      <article className="memberships-row">
        {memberships.map((membership) => (
          <section key={membership.id} className="membership-column">
            <MembershipCard
              membership={membership}
              onSelect={handleSelect}
              isSelected={membership.id === selectedMembershipId}
            />
          </section>
        ))}
      </article>
    </section>
  );
};

export default MembershipList;