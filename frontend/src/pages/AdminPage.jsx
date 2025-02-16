import React, { useEffect } from 'react';
import './styles/AdminPage.css';
import { FaUsers, FaUserTie, FaDumbbell, FaCreditCard } from 'react-icons/fa';
import { FaTools, FaHistory } from 'react-icons/fa';
const AdminPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const adminActions = [
    {
      title: 'Usuarios',
      icon: <FaUsers className="admin-action-icon" />,
      description: 'Administra los usuarios registrados en la plataforma'
    },
    {
      title: 'Entrenadores',
      icon: <FaUserTie className="admin-action-icon" />,
      description: 'Gestiona los entrenadores, sus entrenamientos y clases'
    },
    {
      title: 'Espacios',
      icon: <FaDumbbell className="admin-action-icon" />,
      description: 'Administra las zonas y equipamiento del gimnasio'
    },
    {
      title: 'Membresías',
      icon: <FaCreditCard className="admin-action-icon" />,
      description: 'Gestiona los planes y pagos de membresías'
    },
    
    {
      title: 'Máquinas',
      icon: <FaTools className="admin-action-icon" />,
      description: 'Registra nuevas máquinas, actualiza su estado y calcula costos de reparación'
    },
    {
      title: 'Actividades de Usuario',
      icon: <FaHistory className="admin-action-icon" />,
      description: 'Supervisa las actividades realizadas por los usuarios en el gimnasio'
    }
  ];
  

  return (
    <main className="admin-page">
      <h2 className="admin-page-title">Panel de Administración</h2>
      <section className="admin-dashboard">
        {adminActions.map((action, index) => (
          <div className="admin-action-container">
          <article 
            key={index} 
            className="admin-action-card"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {action.icon}
            <h3 className="admin-action-title">{action.title}</h3>
            <p className="admin-action-description">{action.description}</p>
            <button className="admin-action-button">Gestionar</button>
          </article>
          </div>
        ))}
      </section>
    </main>
  );
};

export default AdminPage;