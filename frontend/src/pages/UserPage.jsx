import React, { useState } from 'react';
import './styles/UserPage.css';
import { FaUser, FaDumbbell, FaHistory, FaClipboardList } from 'react-icons/fa';
import ProfileSection from '../components/user/ProfileSection.jsx';
import ProgressSection from '../components/user/ProgressSection.jsx';
import ActivitiesSection from '../components/user/ActivitiesSection.jsx';
import RoutineSection from '../components/user/RoutineSection.jsx';

const UserPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedDay, setSelectedDay] = useState(null);

  const mockUserData = {
    name: 'John Doe',
    email: 'example@a.com',
    joinDate: '2021-01-01',
    progress: [
      {
        date: '2021-01-01',
        exercises: [
          { name: 'Push-ups', repetitions: 20 },
          { name: 'Squats', repetitions: 30 }
        ]
      },
      {
        date: '2021-01-02',
        exercises: [
          { name: 'Push-ups', repetitions: 25 },
          { name: 'Squats', repetitions: 35 }
        ]
      }
    ],
    activities: [
      { type: 'Login', date: '2021-01-01T08:00:00' },
      { type: 'Exercise', date: '2021-01-01T08:30:00' }
    ],
    routine: {
      Monday: [
        { name: 'Bench Press', sets: 3, reps: 10 },
        { name: 'Deadlift', sets: 3, reps: 8 }
      ],
      Tuesday: [
        { name: 'Pull-Ups', sets: 3, reps: 12 },
        { name: 'Bicep Curls', sets: 3, reps: 15 }
      ],
      Wednesday: [],
      Thursday: [
        { name: 'Squats', sets: 4, reps: 10 },
        { name: 'Lunges', sets: 3, reps: 12 }
      ],
      Friday: [
        { name: 'Overhead Press', sets: 3, reps: 8 },
        { name: 'Tricep Dips', sets: 3, reps: 12 }
      ],
      Saturday: [],
      Sunday: []
    }
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
      <div className="user-content">
        {renderSection()}
      </div>
    </main>
  );
};

export default UserPage;