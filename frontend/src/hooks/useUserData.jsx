import { useState, useEffect } from 'react';
import { updateUser } from '../services/AccountService';
import { useNavigate } from 'react-router-dom';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = (accountData) => {
      try {
        if (accountData) {
          const parsedData = JSON.parse(accountData);
          setUserData(parsedData);
        } else {
          setError('No se encontraron datos de usuario');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        setError('Error al procesar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    const accountData = localStorage.getItem('account');

    if (!accountData) {
      navigate('/login');
    }

    fetchUserData();
  }, []);

  // Función para actualizar datos de usuario en el servidor y localStorage
  const updateUserData = async (updatedData) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Enviar actualización al servidor
      const response = await updateUser(updatedData);

      if (response.success) {
        // Actualizar localStorage con los nuevos datos
        const updatedUserData = { ...userData, ...updatedData };
        localStorage.setItem('account', JSON.stringify(updatedUserData));

        // Actualizar estado local
        setUserData(updatedUserData);
        setMessage({
          type: 'success',
          text: 'Perfil actualizado correctamente'
        });

        return true;
      } else {
        setError(response.message || 'Error al actualizar el perfil');
        setMessage({
          type: 'error',
          text: response.message || 'Error al actualizar el perfil'
        });

        return false;
      }
    } catch (err) {
      const errorMsg = 'Error de conexión con el servidor';
      console.error(errorMsg, err);
      setError(errorMsg);
      setMessage({
        type: 'error',
        text: errorMsg
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar solo el estado local (sin servidor)
  const updateLocalUserData = (data) => {
    const updatedData = { ...userData, ...data };
    setUserData(updatedData);
    return updatedData;
  };

  // Función para limpiar mensajes
  const clearMessage = () => setMessage(null);

  return {
    userData,
    loading,
    error,
    message,
    updateUserData,
    updateLocalUserData,
    clearMessage
  };
};