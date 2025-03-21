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
    username: 'johndoe',

    progress: [
      {
        date: '2021-10-01',
        weight: 80,
        height: 1.80,
        bmi: 24.69,
        exercises: [
          { name: 'Press de banca', repetitions: 12 },
          { name: 'Sentadillas', repetitions: 10 }
        ]
      },
      {
        date: '2021-10-15',
        weight: 78,
        height: 1.80,
        bmi: 24.07,
        exercises: [
          { name: 'Peso muerto', repetitions: 8 },
          { name: 'Dominadas', repetitions: 6 }
        ]
      },
      {
        date: '2021-10-30',
        weight: 76,
        height: 1.80,
        bmi: 23.45,
        exercises: [
          { name: 'Curl de bíceps', repetitions: 15 },
          { name: 'Extensiones de tríceps', repetitions: 12 }
        ]
      }
    ],

    activities: [
      { date: '2021-10-01', type: 'Running', duration: 30, distance: 5 },
      { date: '2021-10-03', type: 'Cycling', duration: 45, distance: 10 },
      { date: '2021-10-05', type: 'Swimming', duration: 60, distance: 1 }
    ],

    routine: {
      monday: [
        { name: 'Press de banca', sets: 3, reps: 12 },
        { name: 'Sentadillas', sets: 4, reps: 10 }
      ],
      tuesday: [
        { name: 'Dominadas', sets: 3, reps: 8 }
      ],
      wednesday: [
        { name: 'Peso muerto', sets: 3, reps: 8 },
        { name: 'Curl de bíceps', sets: 3, reps: 12 }
      ],
      thursday: [
        { name: 'Prensa de piernas', sets: 4, reps: 10 }
      ],
      friday: [
        { name: 'Extensiones de tríceps', sets: 3, reps: 12 },
        { name: 'Elevaciones laterales', sets: 3, reps: 15 }
      ],
      saturday: [
        { name: 'Abdominales', sets: 3, reps: 20 }
      ],
      sunday: []
    }
  };

  const sections = [
    { id: 'profile', name: 'Perfil', icon: <FaUser /> },
    { id: 'progress', name: 'Progreso', icon: <FaDumbbell /> },
    { id: 'activities', name: 'Actividades', icon: <FaHistory /> },
    { id: 'routine', name: 'Rutina', icon: <FaClipboardList /> }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection userData={mockUserData} />;
      case 'progress':
        return <ProgressSection progress={mockUserData.progress} />;
      case 'activities':
        return <ActivitiesSection />;
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