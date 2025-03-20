import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateRegisterAccount } from '../schemas/access.js';
import { registerAccount } from '../services/AccountService.js';
import useAuth from './useAuth.jsx';

export const useRegister = () => {
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const submitRegistration = async (formValues) => {
    const accountData = {
      ...formValues,
      role: role
    };
    return await registerAccount(accountData);
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  const handleRegisterError = (response, setErrors) => {
    setErrors({ email: { _errors: [response.message] } });
  }

  const { errors, handleSubmit } = useAuth(
    validateRegisterAccount,
    submitRegistration,
    handleRegisterSuccess,
    handleRegisterError
  );

  return {
    errors,
    role,
    setRole,
    handleSubmit
  };
};
