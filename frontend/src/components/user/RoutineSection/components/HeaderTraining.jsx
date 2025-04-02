import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import DaySelector from './DaySelector';
import '../styles/HeaderTraining.css';

const HeaderTraining = ({ selectedDay, setSelectedDay, days, hasDayTraining, isMobile }) => {
  return (
    <header className={`training-header ${isMobile ? 'mobile' : ''}`}>
      <FaClipboardList className='header-icon' />
      <h2>Mi Entrenamiento</h2>

      <DaySelector
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        days={days}
        hasDayTraining={hasDayTraining}
      />
    </header>
  );
};

export default HeaderTraining;