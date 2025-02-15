import React from 'react';
import './styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} HammerGym. Todos los derechos reservados.</p>
        <nav className="footer-nav">
        <Link to="/terms" className="footer-link">Términos de Servicio</Link>
        <Link to="/privacy" className="footer-link">Política de Privacidad</Link>
        <Link to="/contact" className="footer-link">Contáctanos</Link>
        </nav>
      </div>
      </footer>
    );
};

export default Footer;