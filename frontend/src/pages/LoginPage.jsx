import React, { useState, useEffect } from 'react';
import './styles/LoginPage.css';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";

import {loginSchema} from '../schemas/access.js';

const LoginPage = ({setShouldShowAccessButton}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => setShouldShowAccessButton(false), []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }


    setErrors({});
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <main className="login-page">
      <h2 className='login-page-title'>ACCEDER</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <main className='login-form-container'>
          <section className="form-group">
            <header className='login-input-header'>
              <label htmlFor="email">Email:</label>

              {errors.email && (
                <p className="error-message">{errors.email._errors.join(', ')}</p>
              )}
            </header>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='login-input'
            />
          </section>
          <section className="form-group">

            <header className='login-input-header'>
              <label htmlFor="password">Contraseña:</label>
              {errors.password && (
                <p className="error-message">{errors.password._errors.join(', ')}</p>
              )}
            </header>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='login-input'
            />

          </section>
        </main>
        <section className='login-form-buttons'>
        <button className='register-link login-submit-button' type="submit">
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