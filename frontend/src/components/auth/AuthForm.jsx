import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import './styles/AuthForm.css';

const AuthForm = ({
  title,
  children,
  onSubmit,
  submitText,
  alternativeLink,
  alternativeText,
  backLink,
  backText,
  onBackClick
}) => {
  return (
    <main className="auth-page">
      <h2 className='auth-page-title'>{title}</h2>

      <form className="auth-form" onSubmit={onSubmit}>
        <main className='auth-form-container'>
          {children}
        </main>

        <section className='auth-form-buttons'>
          <button className='primary-button auth-submit-button' type="submit">
            {submitText}
          </button>
          <Link to={alternativeLink} className='auth-link'>{alternativeText}</Link>
        </section>
      </form>

      <section className='auth-page-back-container'>
        {onBackClick ? (
          <button className='app-link auth-page-back' onClick={onBackClick}>
            <FaLongArrowAltLeft /> {backText}
          </button>
        ) : (
          <Link to={backLink} className='app-link auth-page-back'>
            <FaLongArrowAltLeft /> {backText}
          </Link>
        )}
      </section>
    </main>
  );
};

export default AuthForm;