import { FaUser } from 'react-icons/fa';
import './styles/ProfileSection.css';
import InputProfileSection from './components/InputProfileSection.jsx';
import { useAccount } from '../../../context/AccountContext.jsx';

const ProfileSection = () => {
  const { account, updateAccountData } = useAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const accountData = Object.fromEntries(formData);
    updateAccountData(accountData);
  }

  return (
    <section className='user-info'>
      <header className='user-info-header'>
        <FaUser className='section-icon' />
        <h2>Perfil de Usuario</h2>
      </header>
      <form className='user-info-form' onSubmit={handleSubmit}>
        <article className='user-info-content'>
          <InputProfileSection name="username" label='Nombre de usuario' value={account.username} />
          <InputProfileSection name="email" label='Email' value={account.email} />
        </article>
        <footer className='user-info-footer'>
          <button className='primary-button button'>ACTUALIZAR</button>
        </footer>
      </form>

    </section>
  );
};

export default ProfileSection;