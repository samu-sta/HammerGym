import React, { useState } from 'react';
import './styles/UserPage.css';
import { FaUser, FaDumbbell, FaHistory, FaClipboardList } from 'react-icons/fa';
import ProfileSection from '../components/user/ProfileSection/ProfileSection.jsx';
import ProgressSection from '../components/user/ProgressSection/ProgressSection.jsx';
import ActivitiesSection from '../components/user/ActivitiesSection/ActivitiesSection.jsx';
import RoutineSection from '../components/user/RoutineSection/RoutineSection.jsx';

const UserPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedDay, setSelectedDay] = useState(null);

  const mockUserData = {
    realName: 'John Doe',
    lastNames: 'Smith',
    email: 'example@a.com',
    username: 'johndoe'
  };

  const sections = [
    { id: 'profile', name: 'Perfil', icon: <FaUser /> },
    { id: 'progress', name: 'Progreso', icon: <FaDumbbell /> },
    { id: 'activities', name: 'Actividades', icon: <FaHistory /> },
    { id: 'routine', name: 'Rutina', icon: <FaClipboardList /> }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'profile':
        return <ProfileSection userData={mockUserData} />;
      case 'progress':
        return <ProgressSection progress={mockUserData.progress} />;
      case 'activities':
        return <ActivitiesSection activities={mockUserData.activities} />;
      case 'routine':
        return <RoutineSection 
          routine={mockUserData.routine}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />;
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