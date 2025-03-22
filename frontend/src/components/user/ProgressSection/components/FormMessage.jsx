import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/FormMessage.css';

const FormMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className={`form-message ${message.type}`}>
      {message.type === 'success' ? <FaCheck /> : <FaTimes />}
      {message.text}
    </div>
  );
};

export default FormMessage;