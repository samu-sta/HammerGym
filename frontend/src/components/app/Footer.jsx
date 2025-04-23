import React from 'react';
import './styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} HammerGym. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;