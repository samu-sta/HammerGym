import React from 'react';

const StatusMessage = ({ type, message, timeFilter, filters }) => {
  if (type === 'loading') {
    return <div className='status-message'>Cargando...</div>;
  }

  if (type === 'error') {
    return <div className='status-message error'>{message}</div>;
  }

  if (type === 'empty') {
    if (timeFilter === filters.MONTH) {
      return <div className='status-message'>Sin actividades en los últimos 30 días</div>;
    } else if (timeFilter === filters.WEEK) {
      return <div className='status-message'>Sin actividades en los últimos 7 días</div>;
    }

    return <div className='status-message'>Sin actividades registradas</div>;
  }

  return null;
};

export default React.memo(StatusMessage);