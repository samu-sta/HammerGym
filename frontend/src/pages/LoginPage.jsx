import React, { useState, useEffect } from 'react';
import './styles/LoginPage.css';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import {loginSchema} from '../schemas/access.js';
import { useNavigate } from 'react-router-dom';
const LoginPage = ({setShouldShowAccessButton}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
      setShouldShowAccessButton(false);
      window.scrollTo(0, 0);
    }, []);

    

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }


    setErrors({});
    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else if (data.user.role === 'Entrenador') {
              navigate('/entrenador');
            } else {
              navigate('/usuario');
              }
          } else {
          setErrors({ email: { _errors: [data.message] } });
        }
      });
  };

  return (
    <main className="login-page">
      <h2 className='login-page-title'>ACCEDER</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <main className='login-form-container'>
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