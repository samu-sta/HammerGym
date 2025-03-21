import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';

const ProtectedLayout = ({ allowedRoles = [] }) => {
  const { account, loading } = useAccount();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  if (!account) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log(account);

  if (allowedRoles.length > 0 && !allowedRoles.includes(account.role)) {
    if (account.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (account.role === 'trainer') {
      return <Navigate to="/entrenador" replace />;
    } else {
      return <Navigate to="/usuario" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedLayout;