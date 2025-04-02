import LoadingSpinner from '../../common/LoadingSpinner';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import useUsersList from '../../../hooks/useUsersList';
import UsersGrid from './components/UsersGrid';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import ActionButton from '../../common/ActionButton';
import './styles/UsersList.css';

const UsersList = () => {
  const { users, loading, error, handleCreateTraining, formatDate } = useUsersList();

  if (loading) {
    return <LoadingSpinner message="Cargando lista de usuarios..." />;
  }

  return (
    <main className="users-list-container">
      <header className="users-list-header">
        <h2 className="page-title">
          <FaUserFriends className="page-title-icon" />
          Mis Clientes
        </h2>
        <ActionButton
          icon={<FaPlus />}
          text="Crear Plan de Entrenamiento"
          onClick={handleCreateTraining}
          className="create-training-button"
          additionalClasses="button"
        />
      </header>

      {error ? (
        <ErrorState
          error={error}
          handleCreateTraining={handleCreateTraining}
        />
      ) : users.length === 0 ? (
        <EmptyState handleCreateTraining={handleCreateTraining} />
      ) : (
        <UsersGrid users={users} formatDate={formatDate} />
      )}
    </main>
  );
};

export default UsersList;