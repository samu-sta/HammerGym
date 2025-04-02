import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/FormMessage.css';

const FormMessage = ({ result }) => {
  if (!result) return null;

  return (
    <article className={`form-message ${result.success ? 'success' : 'error'}`}>
      {result.success ? <FaCheck /> : <FaTimes />}
      {result.message}
    </article>
  );
};

export default FormMessage;