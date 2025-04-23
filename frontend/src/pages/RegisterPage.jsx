import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister.jsx';
import FormField from '../components/auth/FormField.jsx';
import RoleSelector from '../components/auth/RoleSelector.jsx';
import AuthForm from '../components/auth/AuthForm.jsx';
import { redirectToAccount } from '../utils/accountUtils.js';
const RegisterPage = ({ setShouldShowAccessButton }) => {
  const { errors, role, setRole, handleSubmit } = useRegister();
  const navigate = useNavigate();

  const account = JSON.parse(localStorage.getItem('account'));

  useEffect(() => {
    if (!account) return;
    navigate(redirectToAccount(account));

  }, [account, navigate]);

  useEffect(() => {
    setShouldShowAccessButton(true);
    window.scrollTo(0, 0);
  }, [setShouldShowAccessButton]);

  const handleBackClick = () => {
    setShouldShowAccessButton(true);
    navigate('/');
  };

  return (
    <AuthForm
      title="REGISTRARSE"
      onSubmit={handleSubmit}
      submitText="Registrarse"
      alternativeLink="/login"
      alternativeText="¿Ya tienes cuenta? Inicia Sesión"
      backText="Volver al Inicio"
      onBackClick={handleBackClick}
    >
      <RoleSelector role={role} setRole={setRole} />
      <FormField
        id="username"
        label="Nombre de usuario"
        errors={errors}
      />
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
      <FormField
        id="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        errors={errors}
      />
    </AuthForm>
  );
};

export default RegisterPage;