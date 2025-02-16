import React, { useState, useEffect } from 'react';
import './styles/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { registrationSchema } from '../schemas/access.js';

const RegisterPage = ({ setShouldShowAccessButton }) => {
  const [role, setRole] = useState('Usuario');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
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

    const result = registrationSchema.safeParse({ role, nombre, apellido, nombreUsuario, email, password, confirmPassword });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    console.log('Role:', role);
    console.log('Nombre:', nombre);
    console.log('Apellido:', apellido);
    console.log('NombreUsuario:', nombreUsuario);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ConfirmPassword:', confirmPassword);
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className='registration-input'
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
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className='registration-input'
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
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className='registration-input'
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
          <section className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='registration-input'
            />
            {errors.confirmPassword ? (
              <p className="error-message">{errors.confirmPassword._errors.join(', ')}</p>
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