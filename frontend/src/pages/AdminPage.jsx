import React, { useEffect } from 'react';
import './styles/AdminPage.css';
import { FaUsers, FaUserTie, FaDumbbell, FaCogs, FaCreditCard } from 'react-icons/fa';
import { FaTools, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const adminActions = [
    {
      title: 'Usuarios',
      icon: <FaUsers className="admin-action-icon" />,
      description: 'Administra los usuarios registrados en la plataforma',
      route: '/admin/users'
    },
    {
      title: 'Entrenadores',
      icon: <FaUserTie className="admin-action-icon" />,
      description: 'Gestiona los entrenadores, sus entrenamientos y clases',
      route: '/admin/trainers'
    },
    {
      title: 'Membresías',
      icon: <FaCreditCard className="admin-action-icon" />,
      description: 'Gestiona los planes de membresía disponibles para los usuarios',
      route: '/admin/memberships'
    },
    {
      title: 'Espacios',
      icon: <FaDumbbell className="admin-action-icon" />,
      description: 'Administra las zonas y equipamiento del gimnasio',
      route: '/admin/gyms'
    },
    {
      title: 'Modelos de Máquina',
      icon: <FaCogs className="admin-action-icon" />,
      description: 'Gestiona los modelos de máquina disponibles',
      route: '/admin/machine-models'
    },

    {
      title: 'Máquinas',
      icon: <FaTools className="admin-action-icon" />,
      description: 'Registra nuevas máquinas, actualiza su estado y calcula costos de reparación',
      route: '/admin/machines'
    },
    {
      title: 'Actividades de Usuario',
      icon: <FaHistory className="admin-action-icon" />,
      description: 'Supervisa las actividades realizadas por los usuarios en el gimnasio',
      route: '/admin/user-activities'
    }
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <main className="admin-page">
      <h2 className="admin-page-title">Panel de Administración</h2>
      <section className="admin-dashboard">
        {adminActions.map((action, index) => (
          <article
            className="admin-action-container admin-action-card"
            key={index}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {action.icon}
            <h3 className="admin-action-title">{action.title}</h3>
            <p className="admin-action-description">{action.description}</p>
            <button
              className="admin-action-button"
              onClick={() => handleActionClick(action.route)}
            >
              Gestionar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
};

export default AdminPage;