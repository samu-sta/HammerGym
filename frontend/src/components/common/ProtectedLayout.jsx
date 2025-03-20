import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';

const ProtectedLayout = ({ allowedRoles = [] }) => {
  const { account, loading } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  if (!account) {
    return navigate('/login', { state: { from: location.pathname } });
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(account.role)) {
    if (account.role === 'admin') {
      return navigate('/admin', { replace: true });
    } else if (account.role === 'trainer') {
      return navigate('/entrenador', { replace: true });
    } else {
      return navigate('/usuario', { replace: true });
    }
  }

  return <Outlet />;
};

export default ProtectedLayout;