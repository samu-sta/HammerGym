import React from 'react';

const ActivityItem = ({ activity, isMobile }) => {
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityLabel = (type) => {
    switch (type.toLowerCase()) {
      case 'entry':
        return 'Entrada';
      case 'exit':
        return 'Salida';
      default:
        return type;
    }
  };

  return (
    <li className={`activity-item activity-${activity.type.toLowerCase()}`}>
      <div className={`activity-time ${isMobile ? 'mobile' : ''}`}>
        {formatTime(activity.dateTime)}
      </div>
      <div className={`activity-dot ${isMobile ? 'mobile' : ''}`}></div>
      <div className='activity-info'>
        <div className={`activity-label ${isMobile ? 'mobile' : ''}`}>
          {getActivityLabel(activity.type)}
        </div>
        <div className={`activity-location ${isMobile ? 'mobile' : ''}`}>
          {activity.gym.location}
        </div>
      </div>
    </li>
  );
};

export default React.memo(ActivityItem);