import React, { useEffect } from 'react';
import './styles/LoginPage.css';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useLogin } from '../hooks/useLogin.jsx';

const LoginPage = ({ setShouldShowAccessButton }) => {
  const { errors, handleSubmit } = useLogin();

  useEffect(() => {
    setShouldShowAccessButton(false);
    window.scrollTo(0, 0);
  }, [setShouldShowAccessButton]);

  return (
    <main className="login-page">
      <h2 className='login-page-title'>ACCEDER</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <main className='login-form-container'>
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
        </main>
        <section className='login-form-buttons'>
          <button className='primary-button login-submit-button' type="submit">
            Iniciar Sesión
          </button>
          <Link to="/register" className='login-link'>¿No tienes cuenta? Regístrate</Link>
        </section>
      </form>
      <section className='login-page-back-container'>
        <Link to="/" className='app-link login-page-back'><FaLongArrowAltLeft /> Volver al Inicio</Link>
      </section>
    </main>
  );
};

export default LoginPage;