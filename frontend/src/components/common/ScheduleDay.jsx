import React from 'react';
import { FaClock } from 'react-icons/fa';
import './styles/ScheduleDay.css';

const ScheduleDay = ({ day, startHour, endHour }) => {
  return (
    <li className="day-schedule">
      <span className="day-name">{day}</span>
      <div className="day-time">
        <FaClock /> {startHour} - {endHour}
      </div>
    </li>
  );
};

export default ScheduleDay;