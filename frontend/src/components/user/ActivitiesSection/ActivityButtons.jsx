import React, { useState, useEffect } from 'react';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { registerActivity } from '../../../services/UserService';
import { fetchAllGyms } from '../../../services/GymService';

const ActivityButtons = ({ isMobile, onActivityRegistered }) => {
  const [gyms, setGyms] = useState([]);
  const [selectedGymId, setSelectedGymId] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await fetchAllGyms();
        console.log('Gyms response:', response); // Para depuración

        if (response && response.length > 0) {
          setGyms(response);
          // Seleccionar explícitamente el ID del primer gimnasio como string para evitar problemas
          const firstGymId = response[0].id.toString();
          console.log('Seleccionando gimnasio inicial con ID:', firstGymId); // Para depuración
          setSelectedGymId(firstGymId);
        }
      } catch (error) {
        console.error('Error fetching gyms:', error);
      }
    };

    fetchGyms();
  }, []);

  const handleRegisterActivity = async (type) => {
    if (!selectedGymId) {
      setNotification({
        type: 'error',
        message: 'Por favor, selecciona un gimnasio'
      });
      return;
    }

    console.log('Registrando actividad con gymId:', selectedGymId); // Para depuración

    setLoading(true);
    // Usar "Entry" y "Exit" con la primera letra en mayúscula, según requiere el backend
    const activityType = type === 'entry' ? 'Entry' : 'Exit';
    // Convertir gymId a número (parseInt) ya que el backend espera un número entero
    const gymIdNumber = parseInt(selectedGymId, 10);
    const response = await registerActivity(activityType, gymIdNumber);
    setLoading(false);

    if (response.success) {
      setNotification({
        type: 'success',
        message: type === 'entry'
          ? 'Entrada registrada correctamente'
          : 'Salida registrada correctamente'
      });

      // Notificar al componente padre para que actualice la lista de actividades
      if (onActivityRegistered) {
        onActivityRegistered();
      }
    } else {
      setNotification({
        type: 'error',
        message: response.message || 'Error al registrar la actividad'
      });
    }

    // Limpiar la notificación después de 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div>
      <div className="activity-select-container">
        <label htmlFor="gym-select" className="activity-select-label">
          Selecciona un gimnasio:
        </label>
        <select
          id="gym-select"
          className="activity-select"
          value={selectedGymId}
          onChange={(e) => {
            console.log('Gimnasio seleccionado:', e.target.value); // Para depuración
            setSelectedGymId(e.target.value);
          }}
          disabled={loading}
        >
          {gyms.length === 0 && (
            <option value="">Cargando gimnasios...</option>
          )}
          {gyms.map((gym) => (
            <option key={gym.id} value={gym.id.toString()}>
              {gym.name || gym.location}
            </option>
          ))}
        </select>
      </div>

      <div className={`activity-buttons-container ${isMobile ? 'mobile' : ''}`}>
        <button
          className={`activity-button entry ${isMobile ? 'mobile' : ''} ${loading ? 'disabled' : ''}`}
          onClick={() => handleRegisterActivity('entry')}
          disabled={loading || !selectedGymId}
        >
          <FaDoorOpen /> Entrada
        </button>
        <button
          className={`activity-button exit ${isMobile ? 'mobile' : ''} ${loading ? 'disabled' : ''}`}
          onClick={() => handleRegisterActivity('exit')}
          disabled={loading || !selectedGymId}
        >
          <FaDoorClosed /> Salida
        </button>
      </div>

      {notification && (
        <div className={`activity-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ActivityButtons;