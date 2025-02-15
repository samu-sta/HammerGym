import React, {useEffect, useState} from 'react';
import './styles/AccessHome.css';
import { Link } from 'react-router-dom';

const AccessHome = ({personal, linkRegister, isScrolling}) => {
  const Icon = personal.icon;

  const [applyHover, setApplyHover] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isScrolling) {
      timeoutId = setTimeout(() => {
        setApplyHover(true);
      }, personal.delay); // Use personal.delay here
    } else {
      setApplyHover(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isScrolling, personal.delay]);
  
  return (
    <article className={`access-home-article ${applyHover ? 'access-home-article-hover' : ''}`}>
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
        <Link className='app-link register-link' to={linkRegister}>INSCRÍBETE</Link>
      </section>
      
    </article>
  );
};

export default AccessHome;