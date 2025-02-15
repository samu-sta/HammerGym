import React, { useState, useEffect } from 'react';
import './styles/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { registrationSchema } from '../schemas/access.js';

const RegisterPage = ({ setShouldShowAccessButton }) => {
  const [role, setRole] = useState('Usuario');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => setShouldShowAccessButton(true), []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = registrationSchema.safeParse({ role, name, surname, username, email, password });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    console.log('Role:', role);
    console.log('Name:', name);
    console.log('Surname:', surname);
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
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
            <div className="custom-select">
              <div
                className={`custom-select-option ${role === 'Usuario' ? 'selected' : ''}`}
                onClick={() => setRole('Usuario')}
              >
                Usuario
              </div>
              <div
                className={`custom-select-option ${role === 'Entrenador' ? 'selected' : ''}`}
                onClick={() => setRole('Entrenador')}
              >
                Entrenador
              </div>
            </div>
          </section>
          <section className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='registration-input'
            />
            {errors.name ? (
              <p className="error-message">{errors.name._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="surname">Apellido/s:</label>
            <input
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className='registration-input'
            />
            {errors.surname ? (
              <p className="error-message">{errors.surname._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='registration-input'
            />
            {errors.username ? (
              <p className="error-message">{errors.username._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
          <section className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='registration-input'
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
              className='registration-input'
            />
            {errors.password ? (
              <p className="error-message">{errors.password._errors.join(', ')}</p>
            )
              : (<p className="error-message"/>)}
          </section>
        </main>
        <section className='registration-form-buttons'>
          <button className='register-link registration-submit-button' type="submit">
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