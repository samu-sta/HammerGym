import React from 'react';
import './styles/AccessHome.css';
import { Link } from 'react-router-dom';

const AccessHome = ({personal, linkRegister, linkLogin}) => {
  const Icon = personal.icon;
  
  return (
    <article className="access-home-article">
      <main className="access-home-main">
      <aside className="access-home-icon-container">
        <Icon className="access-home-icon" />
        </aside>
      <h3 className="access-account-home-title">{personal.name}</h3>
      <ul className="access-home-actions">
        {personal.actions.map((action, index) => {
          return (
            <li key={index} className="access-home-action">{action}</li>
          );
        })}
      </ul>
      </main>
      
      <section className="access-home-links">
        <Link className='app-link login-link' to={linkLogin}>ACCEDER</Link>
        <Link className='app-link register-link' to={linkRegister}>INSCRÍBETE</Link>
      </section>
      
    </article>
  );
};

export default AccessHome;