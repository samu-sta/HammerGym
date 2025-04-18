import { FaUser, FaFileContract } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/ProfileSection.css';
import InputProfileSection from './components/InputProfileSection.jsx';
import { useAccount } from '../../../context/AccountContext.jsx';

const ProfileSection = () => {
  const { account, updateAccountData } = useAccount();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const accountData = Object.fromEntries(formData);
    updateAccountData(accountData);
  }

  const handleMembershipClick = () => {
    navigate('/usuario/contratos');
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

      <div className='membership-section'>
        <h3>Gestión de Membresía</h3>
        <p>Accede a tu membresía actual, historial de contratos o adquiere una nueva membresía.</p>
        <button
          className='membership-button'
          onClick={handleMembershipClick}
        >
          <FaFileContract className='membership-icon' />
          <span>Ver mi membresía</span>
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;