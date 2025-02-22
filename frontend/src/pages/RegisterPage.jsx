import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { registrationSchema } from '../schemas/access.js';

const RegisterPage = ({ setShouldShowAccessButton }) => {
  const [role, setRole] = useState('Usuario');
  const [realName, setRealName] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setShouldShowAccessButton(true);
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      role,
      realName,
      lastNames,
      username,
      email,
      password,
      confirmPassword
    };

    const result = registrationSchema.safeParse(data);


    if (!result.success) {
      const formattedErrors = result.error.format();
      console.log(formattedErrors);
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    fetch('http://localhost:3000/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log(data);
          navigate('/login');
        } else {
          setErrors({ email: { _errors: [data.message] } });
        }
      }
      );
  };

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
            <label htmlFor="nombre">Nombre real:</label>
            <input
              id="nombre"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              className='input'
            />
            {errors.nombre ? (
              <p className="error-message">{errors.nombre._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="apellido">Apellido/s:</label>
            <input
              id="apellido"
              value={lastNames}
              onChange={(e) => setLastNames(e.target.value)}
              className='input'
            />
            {errors.apellido ? (
              <p className="error-message">{errors.apellido._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="nombreUsuario">Nombre de usuario:</label>
            <input
              id="nombreUsuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='input'
            />
            {errors.nombreUsuario ? (
              <p className="error-message">{errors.nombreUsuario._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input'
            />
            {errors.email ? (
              <p className="error-message">{errors.email._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='input'
            />
            {errors.password ? (
              <p className="error-message">{errors.password._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='input'
            />
            {errors.confirmPassword ? (
              <p className="error-message">{errors.confirmPassword._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
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