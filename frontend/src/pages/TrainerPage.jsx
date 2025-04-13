import { useState } from 'react';
import './styles/UserPage.css';
import { FaUser, FaDumbbell, FaHistory, FaClipboardList } from 'react-icons/fa';
import ProfileSection from '../components/user/ProfileSection/ProfileSection.jsx';
import ActivitiesSection from '../components/user/ActivitiesSection/ActivitiesSection.jsx';
import CreateTraining from '../components/trainer/createTraining/CreateTraining.jsx';
import UsersList from '../components/trainer/usersList/UsersList.jsx';
import TrainerClassesSection from '../components/trainer/classesSection/TrainerClassesSection.jsx';

const TrainerPage = () => {
  const [activeSection, setActiveSection] = useState('userRoutines');

  const sections = [
    { id: 'profile', name: 'Perfil', icon: <FaUser /> },
    { id: 'classes', name: 'Clases', icon: <FaDumbbell /> },
    { id: 'userRoutines', name: 'Rutinas', icon: <FaClipboardList /> }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'activities':
        return <ActivitiesSection />;
      case 'classes':
        return <TrainerClassesSection />;
      case 'userRoutines':
        return <UsersList />;
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

export default TrainerPage;