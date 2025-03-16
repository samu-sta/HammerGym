import React, { useEffect } from 'react';
import './styles/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useRegister } from '../hooks/useRegister.jsx';

const RegisterPage = ({ setShouldShowAccessButton }) => {
  const { errors, role, setRole, handleSubmit } = useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    setShouldShowAccessButton(true);
    window.scrollTo(0, 0);
  }, [setShouldShowAccessButton]);

  const handleBackClick = () => {
    setShouldShowAccessButton(true);
    navigate('/');
  };

  return (
    <main className="registration-page">
      <h2 className='registration-page-title'>REGISTRARSE</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <main className='registration-form-container'>
          <section className="form-group">
            <label htmlFor="role">Rol:</label>
            <section className="custom-select">
              <article
                className={`custom-select-option ${role === 'Usuario' ? 'selected' : ''}`}
                onClick={() => setRole('Usuario')}
              >
                Usuario
              </article>
              <article
                className={`custom-select-option ${role === 'Entrenador' ? 'selected' : ''}`}
                onClick={() => setRole('Entrenador')}
              >
                Entrenador
              </article>
            </section>
          </section>
          <section className="form-group">
            <label htmlFor="realName">Nombre real:</label>
            <input
              id="realName"
              name="realName"
              className='input'
            />
            {errors.realName ? (
              <p className="error-message">{errors.realName._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
          <section className="form-group">
            <label htmlFor="lastNames">Apellido/s:</label>
            <input
              id="lastNames"
              name="lastNames"
              className='input'
            />
            {errors.lastNames ? (
              <p className="error-message">{errors.lastNames._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
          <section className="form-group">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              id="username"
              name="username"
              className='input'
            />
            {errors.username ? (
              <p className="error-message">{errors.username._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
          <section className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              className='input'
            />
            {errors.email ? (
              <p className="error-message">{errors.email._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
          <section className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              className='input'
            />
            {errors.password ? (
              <p className="error-message">{errors.password._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
          <section className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className='input'
            />
            {errors.confirmPassword ? (
              <p className="error-message">{errors.confirmPassword._errors.join(', ')}</p>
            ) : (<p className="error-message" />)}
          </section>
        </main>
        <section className='registration-form-buttons'>
          <button className='primary-button registration-submit-button' type="submit">
            Registrarse
          </button>
          <Link to="/login" className='login-link'>¿Ya tienes cuenta? Inicia Sesión</Link>
        </section>
      </form>
      <section className='registration-page-back-container'>
        <button className='app-link registration-page-back' onClick={handleBackClick}>
          <FaLongArrowAltLeft /> Volver al Inicio
        </button>
      </section>
    </main>
  );
};

export default RegisterPage;