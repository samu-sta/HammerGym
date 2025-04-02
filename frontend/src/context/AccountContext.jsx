import { useContext, createContext, useState, useEffect } from 'react';
import { updateAccount } from '../services/AccountService';
import { logoutAccount } from '../services/AccountService';
import { Navigate } from 'react-router-dom';
const AccountContext = createContext();

// Proveedor del contexto
export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccountFromStorage = () => {
      try {
        const storedAccount = localStorage.getItem('account');
        if (storedAccount) {
          setAccount(JSON.parse(storedAccount));
        }
      } catch (err) {
        console.error('Error loading account data:', err);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadAccountFromStorage();
  }, []);

  const updateAccountData = async (accountData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateAccount(accountData);

      if (!response.success) {
        setError(response.message || 'Error al actualizar el perfil');
        return response;
      }
      const updatedAccount = response.account
      setAccountData(updatedAccount);
      return response;

    }
    catch (err) {
      setError(errorMsg);
    }
    finally {
      setLoading(false);
    }
  };

  const setAccountData = (accountData) => {
    localStorage.setItem('account', JSON.stringify({ ...account, ...accountData }));
    setAccount({ ...account, ...accountData });

  };

  const logout = () => {
    localStorage.removeItem('account');
    setAccount(null);
    logoutAccount();
    return <Navigate to='/' />;
  };

  const hasRole = (role) => {
    return account && account.role === role;
  };

  const value = {
    account,
    setAccountData,
    updateAccountData,
    logout,
    loading,
    error,
    hasRole
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('accountUser debe usarse dentro de un AccountProvider');
  }
  return context;
};
