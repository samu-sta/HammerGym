import React from 'react';
import { FaUser, FaChartLine, FaDumbbell, FaLightbulb } from 'react-icons/fa';
import UserInfo from './UserInfo';
import ActionLink from '../../../common/ActionLink';
import '../styles/UserCard.css';

const UserCard = ({ user, formatDate }) => {
  return (
    <article className="user-card">
      <header className="user-card-header">
        <h3 className="user-name">{user.username}</h3>
        <FaUser className="user-icon" />
      </header>
      <main className="user-card-content">
        <UserInfo
          email={user.email}
          assignedDate={user.assignedAt}
          formatDate={formatDate}
        />
        <aside className="user-card-footer">
          <ActionLink
            to={`/entrenador/${user.email}/progress`}
            icon={<FaChartLine className="button-icon" />}
            text="Ver Progreso"
            className="view-progress-button"
          />
          <ActionLink
            to={`/entrenador/training/${user.email}`}
            icon={<FaDumbbell className="button-icon" />}
            text="Ver Entrenamiento"
            className="view-training-button"
          />
          <ActionLink
            to={`/entrenador/${user.email}/decision`}
            icon={<FaLightbulb className="button-icon" />}
            text="Decisión"
            className="decision-button"
          />
        </aside>
      </main>
    </article>
  );
};

export default UserCard;