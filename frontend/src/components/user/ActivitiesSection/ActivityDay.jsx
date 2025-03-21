import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import ActivityItem from './ActivityItem';

const ActivityDay = ({ dayGroup, isExpanded, onToggle, isMobile }) => {
  const formatDateHeader = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <li className={`timeline-day ${isExpanded ? 'expanded' : ''}`}>
      <div className='day-header' onClick={onToggle}>
        <span className='day-label'>{formatDateHeader(dayGroup.date)}</span>
        <span className='day-count'>
          {dayGroup.activities.length} {dayGroup.activities.length === 1 ? 'actividad' : 'actividades'}
        </span>
        <FaAngleDown className='expand-icon' />
      </div>

      <ul className='day-activities'>
        {dayGroup.activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isMobile={isMobile}
          />
        ))}
      </ul>
    </li>
  );
};

export default React.memo(ActivityDay);