import React, { useState } from 'react';
import './styles/UserPage.css';
import { FaUser, FaDumbbell, FaHistory, FaClipboardList } from 'react-icons/fa';
import ProfileSection from '../components/user/ProfileSection/ProfileSection.jsx';
import ActivitiesSection from '../components/user/ActivitiesSection/ActivitiesSection.jsx';
import RoutineSection from '../components/user/RoutineSection/RoutineSection.jsx';

const UserPage = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', name: 'Perfil', icon: <FaUser /> },
    { id: 'activities', name: 'Actividades', icon: <FaHistory /> },
    { id: 'routine', name: 'Rutina', icon: <FaClipboardList /> }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'activities':
        return <ActivitiesSection />;
      case 'routine':
        return <RoutineSection />;
      default:
        return null;
    }
  };

  return (
    <main className='user-page'>
      <nav className="user-nav">
        {sections.map((section) => (
          <article
            key={section.id}
            className={`nav-option ${activeSection === section.id ? 'selected' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.icon}
            <span>{section.name}</span>
          </article>
        ))}
      </nav>
      <main className="user-content">
        {renderSection()}
      </main>
    </main>
  );
};

export default UserPage;