import { useState } from 'react';
import { useAccount } from '../context/AccountContext';

export const useUserData = () => {
  const {
    account,
    loading,
    error,
    updateAccountData,
    setAccountData
  } = useAccount();

  const [message, setMessage] = useState(null);

  const updateUserData = async (updatedData) => {
    setMessage(null);

    try {
      const response = await updateAccountData(updatedData);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Perfil actualizado correctamente'
        });
        return true;
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Error al actualizar el perfil'
        });
        return false;
      }
    } catch (err) {
      const errorMsg = 'Error de conexión con el servidor';
      console.error(errorMsg, err);
      setMessage({
        type: 'error',
        text: errorMsg
      });
      return false;
    }
  };

  const updateLocalUserData = (data) => {
    const updatedData = { ...account, ...data };
    setAccountData(updatedData);
    return updatedData;
  };

  const clearMessage = () => setMessage(null);

  return {
    userData: account,
    loading,
    error,
    message,
    updateUserData,
    updateLocalUserData,
    clearMessage
  };
};