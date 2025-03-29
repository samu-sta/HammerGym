import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/FormMessage.css';

const FormMessage = ({ message }) => {
  if (!message) return null;

  return (
    <article className={`form-message ${message.success ? 'success' : 'error'}`}>
      {message.success ? <FaCheck /> : <FaTimes />}
      {message}
    </article>
  );
};

export default FormMessage;