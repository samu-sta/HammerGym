import React from 'react';
import { Link } from 'react-router-dom';
import { TbAlignJustified } from "react-icons/tb";
import './styles/Header.css';
import DropdownHeader from './DropdownHeader.jsx';
import { useAccount } from '../../context/AccountContext.jsx';
const Header = ({
  isMenuOpen,
  toggleMenu,
  isMobile
}) => {

  const { account, logout } = useAccount();

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
    <header className='header-app'>
      <section className='header-app-left'>
        <Link to="/" className='app-link'>
          <img src="HammerStrength.png" alt="logo" className='header-app-logo' />
        </Link>

        {!isMobile && (
          <nav className='header-app-nav'>
            <Link
              to={getAccountUrl()}
              className='app-link header-app-nav-link'>
              CUENTA
            </Link>
            <Link
              to="/gimnasios"
              className='app-link header-app-nav-link'>
              GIMNASIOS
            </Link>
          </nav>
        )}
      </section>

      <section className='header-app-right'>
        {account
          ?
          <button
            className='app-link header-link'
            onClick={logout}>
            CERRAR SESIÓN
          </button>

          :
          (
            <Link
              to="/login"
              className='app-link header-link'>
              ACCEDER
            </Link>
          )}

        {isMobile && (
          <>
            <TbAlignJustified
              className='app-link header-app-right-options'
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
              }}
            />
            {isMenuOpen && (<DropdownHeader />)}
          </>
        )}
      </section>
    </header>
  );
};

export default Header;