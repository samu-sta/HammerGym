import React from 'react';
import './styles/NotFound.css';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaLongArrowAltLeft } from 'react-icons/fa';
const NotFound = () => {
  return (
    <main className="not-found-page">
      <section className="not-found-container">
        <FaExclamationTriangle className="not-found-icon" />
        <h2 className="not-found-title">404</h2>
        <h3 className="not-found-subtitle">¡Ups! Página no encontrada</h3>
        <p className="not-found-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida (estas flaco).
        </p>
      </section>
      <Link to="/" className='login-page-back not-found-link'><FaLongArrowAltLeft /> Volver al Inicio</Link>
    </main>
  );
};

export default NotFound;