import React from 'react';
import { FaListAlt, FaChartBar, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import ActionButton from '../../../common/ActionButton';
import '../styles/ProgressHeader.css';

const ProgressHeader = ({ userData, progressCount, viewMode, toggleViewMode }) => {
  // Formatear fecha para mostrar cuando el usuario se unió
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="progress-header">
      <div className="user-info-summary">
        {userData && (
          <>
            <div className="user-details">
              <p className="user-email">
                <FaEnvelope className="user-icon" />
                {userData.email}
              </p>
              {userData.memberSince && (
                <p className="user-since">
                  <FaCalendarAlt className="user-icon" />
                  Cliente desde: {formatDate(userData.memberSince)}
                </p>
              )}
            </div>
            <div className="stats-summary">
              <div className="stat-item">
                <div className="stat-value">{progressCount}</div>
                <div className="stat-label">Registros</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="view-controls">
        <ActionButton
          icon={<FaChartBar />}
          text="Gráfico"
          className={`view-button ${viewMode === 'chart' ? 'active' : ''}`}
          onClick={() => viewMode !== 'chart' && toggleViewMode()}
          disabled={viewMode === 'chart'}
        />
        <ActionButton
          icon={<FaListAlt />}
          text="Lista"
          className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => viewMode !== 'list' && toggleViewMode()}
          disabled={viewMode === 'list'}
        />
      </div>
    </div>
  );
};

export default ProgressHeader;