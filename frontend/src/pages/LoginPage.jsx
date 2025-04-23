import React, { useEffect } from 'react';
import { useLogin } from '../hooks/useLogin.jsx';
import FormField from '../components/auth/FormField.jsx';
import AuthForm from '../components/auth/AuthForm.jsx';
import { useNavigate } from 'react-router-dom';
import { redirectToAccount } from '../utils/accountUtils.js';
const LoginPage = ({ setShouldShowAccessButton }) => {
  const navigate = useNavigate();
  const account = JSON.parse(localStorage.getItem('account'));

  useEffect(() => {
    if (!account) return;
    navigate(redirectToAccount(account));

  }, [account, navigate]);

  const { errors, handleSubmit } = useLogin();

  useEffect(() => {
    setShouldShowAccessButton(false);
    window.scrollTo(0, 0);
  }, [setShouldShowAccessButton]);

  return (
    <AuthForm
      title="ACCEDER"
      onSubmit={handleSubmit}
      submitText="Iniciar Sesión"
      alternativeLink="/register"
      alternativeText="¿No tienes cuenta? Regístrate"
      backLink="/"
      backText="Volver al Inicio"
    >
      <FormField
        id="email"
        label="Email"
        errors={errors}
      />
      <FormField
        id="password"
        label="Contraseña"
        type="password"
        errors={errors}
      />
    </AuthForm>
  );
};

export default LoginPage;