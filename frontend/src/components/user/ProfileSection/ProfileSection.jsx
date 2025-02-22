import React from 'react';
import { FaUser } from 'react-icons/fa';
import './styles/ProfileSection.css';
import InputProfileSection from './components/InputProfileSection.jsx';
const ProfileSection = ({ userData }) => {
  return (
    <section className='user-info'>
      <header className='user-info-header'>
        <FaUser className='section-icon' />
        <h2>Perfil de Usuario</h2>
      </header>
      <article className='user-info-content'>
        <InputProfileSection label='Nombre Real' value={userData.realName} />
        <InputProfileSection label='Apellidos' value={userData.lastNames} />
        <InputProfileSection label='Nombre de usuario' value={userData.username} />
        <InputProfileSection label='Correo Electrónico' value={userData.email} />
      </article>
      <footer className='user-info-footer'>
        <button className='primary-button button'>ACTUALIZAR</button>
      </footer>
    </section>
  );
};

export default ProfileSection;