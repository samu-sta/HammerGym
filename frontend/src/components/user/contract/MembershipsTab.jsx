import React from 'react';
import MembershipList from '../memberships/MembershipList';
import './styles/MembershipsTab.css';

const MembershipsTab = ({ onMembershipSelect, selectedMembershipId }) => {
  return (
    <article className="contract-article">
      <MembershipList
        onMembershipSelect={onMembershipSelect}
        selectedMembershipId={selectedMembershipId}
      />
    </article>
  );
};

export default MembershipsTab;