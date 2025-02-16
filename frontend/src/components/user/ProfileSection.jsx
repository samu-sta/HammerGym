import React from 'react';
import { FaUser } from 'react-icons/fa';
import './styles/ProfileSection.css';

const ProfileSection = ({ userData }) => {
  return (
    <section className='user-info'>
      <header className='user-info-header'>
        <FaUser className='section-icon' />
        <h2>Perfil de Usuario</h2>
      </header>
      <article className='user-info-content'>
        <p><strong>Nombre:</strong> {userData.name}</p>
        <p><strong>Correo:</strong> {userData.email}</p>
        <p><strong>Miembro desde:</strong> {new Date(userData.joinDate).toLocaleDateString()}</p>
      </article>
    </section>
  );
};

export default ProfileSection;