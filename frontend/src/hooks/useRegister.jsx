import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationSchema } from '../schemas/access.js';
import { registerUser } from '../utils/fetchUserData.js';

export const useRegister = () => {
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('Usuario');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
      role: role,
      realName: formData.get('realName'),
      lastNames: formData.get('lastNames'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    };

    const result = registrationSchema.safeParse(userData);

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    const data = await registerUser(userData);

    if (data.success) {
      navigate('/login');
    } else {
      setErrors({ email: { _errors: [data.message] } });
    }
  };

  return {
    errors,
    role,
    setRole,
    handleSubmit
  };
};