import { useNavigate } from 'react-router-dom';
import { validateLoginAccount } from '../schemas/access.js';
import { loginAccount } from '../services/AccountService.js';
import useAuth from './useAuth.jsx';
import { useAccount } from '../context/AccountContext';

const INVALID_CREDENTIALS = 'Credenciales inválidas';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAccountData } = useAccount();

  const submitLogin = async (formValues) => {
    return await loginAccount(formValues.email, formValues.password);
  };

  const handleLoginSuccess = (response) => {
    setAccountData(response.account);

    if (response.account.role === 'admin') {
      navigate('/admin');
    } else if (response.account.role === 'trainer') {
      navigate('/entrenador');
    } else {
      navigate('/usuario');
    }
  };

  const handleLoginError = (response, setErrors) => {
    setErrors({
      email: { _errors: [INVALID_CREDENTIALS] },
      password: { _errors: [INVALID_CREDENTIALS] }
    });
  };

  const { errors, handleSubmit } = useAuth(
    validateLoginAccount,
    submitLogin,
    handleLoginSuccess,
    handleLoginError
  );

  return { errors, handleSubmit };
};