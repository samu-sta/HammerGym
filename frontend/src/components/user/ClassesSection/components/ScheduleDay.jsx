import React from 'react';
import { FaClock } from 'react-icons/fa';
import '../styles/ScheduleDay.css';

const ScheduleDay = ({ day, startHour, endHour, formatHour, getDayName }) => (
  <li className="day-schedule">
    <strong className="day-name">{getDayName(day)}</strong>
    <time className="day-time">
      <FaClock /> {formatHour(startHour)} - {formatHour(endHour)}
    </time>
  </li>
);

export default ScheduleDay;