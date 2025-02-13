import React from 'react';
import { Link } from 'react-router-dom';
import './styles/DropdownHeader.css';

const DropdownHeader = () => {
  return (
    <article className="dropdown-menu">
      <Link to="/exercises" className='dropdown-item'>EJERCICIOS</Link>
      <Link to="/routines" className='dropdown-item'>RUTINAS</Link>
      <Link to="/trainers" className='dropdown-item'>ENTRENADORES</Link>
    </article>
  );
};

export default DropdownHeader;