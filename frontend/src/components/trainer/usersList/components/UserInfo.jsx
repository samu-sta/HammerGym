import React from 'react';
import { FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import '../styles/UserInfo.css';
const UserInfo = ({ email, assignedDate, formatDate }) => {
  return (
    <section className="user-card-body">
      <p className="user-email">
        <FaEnvelope className="email-icon" />
        {email}
      </p>
      <p className="user-assigned-date">
        <FaCalendarAlt className="calendar-icon" />
        <span>Cliente desde:</span> {formatDate(assignedDate)}
      </p>
    </section>
  );
};

export default UserInfo;