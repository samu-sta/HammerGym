import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas/access.js';
import { loginUser } from '../utils/fetchUserData.js';

export const useLogin = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    const data = await loginUser(email, password);

    if (!data.success) {
      setErrors({ email: { _errors: [data.message] } });
      return
    }
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.user.role === 'admin') {
      navigate('/admin');
    } else if (data.user.role === 'Entrenador') {
      navigate('/entrenador');
    } else {
      navigate('/usuario');
    }
  };

  return {
    errors,
    handleSubmit
  };

}