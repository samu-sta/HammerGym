import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChartLine, FaArrowLeft } from 'react-icons/fa';
import useUserProgress from '../../../hooks/useUserProgress';
import LoadingSpinner from '../../common/LoadingSpinner';
import ProgressHeader from './components/ProgressHeader';
import ProgressChart from './components/ProgressChart';
import ProgressList from './components/ProgressList';
import ActionButton from '../../common/ActionButton';
import ErrorState from '../../common/ErrorState';
import './styles/UserProgress.css';

const UserProgress = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('chart');

  const {
    userData,
    progressData,
    loading,
    error
  } = useUserProgress(email);

  const handleGoBack = () => {
    navigate('/entrenador');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'list' : 'chart');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de progreso..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        actionText="Volver a la lista de usuarios"
        handleAction={handleGoBack}
      />
    );
  }

  return (
    <main className="user-progress-container">
      <header className="user-progress-header">
        <ActionButton
          icon={<FaArrowLeft />}
          text="Volver"
          onClick={handleGoBack}
          className="back-button"
        />
        <h2 className="page-title">
          <FaChartLine className="page-title-icon" />
          Progreso de {userData?.username || email}
        </h2>
      </header>

      <ProgressHeader
        userData={userData}
        progressCount={progressData.length}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
      />

      <main className="progress-content">
        {progressData.length === 0 ? (
          <div className="no-progress-data">
            <p>Este usuario aún no ha registrado ningún progreso.</p>
          </div>
        ) : viewMode === 'chart' ? (
          <ProgressChart progressData={progressData} />
        ) : (
          <ProgressList progressData={progressData} />
        )}
      </main>
    </main>
  );
};

export default UserProgress;