import { FaUser } from 'react-icons/fa';
import './styles/ProfileSection.css';
import InputProfileSection from './components/InputProfileSection.jsx';
import { useAccount } from '../../../context/AccountContext.jsx';

const ProfileSection = () => {
  const { account, setAccount } = useAccount();

  return (
    <section className='user-info'>
      <header className='user-info-header'>
        <FaUser className='section-icon' />
        <h2>Perfil de Usuario</h2>
      </header>
      <article className='user-info-content'>

        <InputProfileSection label='Nombre de usuario' value={account.username} onChange={(e) => setAccount({ ...userData, username: e.target.value })} />
        <InputProfileSection label='Email' value={account.email} onChange={(e) => setAccount({ ...userData, email: e.target.value })} />
      </article>
      <footer className='user-info-footer'>
        <button className='primary-button button'>ACTUALIZAR</button>
      </footer>
    </section>
  );
};

export default ProfileSection;