import React, { useEffect } from 'react';
import './styles/AdminPage.css';
import { FaUsers, FaUserTie, FaDumbbell, FaCogs, FaCreditCard, FaFileContract, FaListUl } from 'react-icons/fa';
import { FaTools, FaHistory, FaDollarSign, FaRunning } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { STRIPE_URL_DASHBOARD } from '../config/constants';

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
      title: 'Decisión de Entrenadores',
      icon: <FaUserTie className="admin-action-icon" />,
      description: 'Análisis de rendimiento y KPIs para decisiones estratégicas',
      route: '/admin/trainer-decision'
    },
    {
      title: 'Ejercicios',
      icon: <FaRunning className="admin-action-icon" />,
      description: 'Gestiona el catálogo de ejercicios disponibles para entrenamiento',
      route: '/admin/exercises'
    },
    {
      title: 'Membresías',
      icon: <FaCreditCard className="admin-action-icon" />,
      description: 'Gestiona los planes de membresía disponibles para los usuarios',
      route: '/admin/memberships'
    },
    {
      title: 'Características de Membresías',
      icon: <FaListUl className="admin-action-icon" />,
      description: 'Administra las características incluidas en cada tipo de membresía',
      route: '/admin/membership-features'
    },
    {
      title: 'Contratos',
      icon: <FaFileContract className="admin-action-icon" />,
      description: 'Administra los contratos de membresía de los usuarios',
      route: '/admin/contracts'
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
      title: 'Gestión de Pagos',
      icon: <FaDollarSign className="admin-action-icon" />,
      description: 'Accede al dashboard de Stripe para visualizar todos los pagos realizados',
      externalLink: true,
      route: STRIPE_URL_DASHBOARD
    }
  ];

  const handleActionClick = (route, isExternalLink) => {
    console.log('Clicked route:', route);
    if (isExternalLink) {
      window.open(route, '_blank');
    } else {
      navigate(route);
    }
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
              onClick={() => handleActionClick(action.route, action.externalLink)}
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