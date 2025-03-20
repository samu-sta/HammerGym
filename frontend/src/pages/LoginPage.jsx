import React, { useEffect } from 'react';
import { useLogin } from '../hooks/useLogin.jsx';
import FormField from '../components/auth/FormField.jsx';
import AuthForm from '../components/auth/AuthForm.jsx';

const LoginPage = ({ setShouldShowAccessButton }) => {
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