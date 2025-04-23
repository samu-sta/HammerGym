import React from 'react';
import { Link } from 'react-router-dom';
import './styles/DropdownHeader.css';
import { useAccount } from '../../context/AccountContext.jsx';

const DropdownHeader = () => {
  const { account } = useAccount();

  const getAccountUrl = () => {
    if (!account) return '/login';

    switch (account.role) {
      case 'admin':
        return '/admin';
      case 'trainer':
        return '/entrenador';
      case 'user':
        return '/usuario';
      default:
        return '/login';
    }
  };

  return (
    <article className="dropdown-menu">
      <Link to={getAccountUrl()} className='dropdown-item'>CUENTA</Link>
      <Link to="/gimnasios" className='dropdown-item'>GIMNASIOS</Link>
    </article>
  );
};

export default DropdownHeader;