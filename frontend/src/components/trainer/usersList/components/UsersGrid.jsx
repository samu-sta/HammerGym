import UserCard from './UserCard';
import '../styles/UsersGrid.css';

const UsersGrid = ({ users, formatDate }) => {
  return (
    <section className="users-grid">
      {users.map((user, index) => (
        <UserCard
          key={index}
          user={user}
          formatDate={formatDate}
        />
      ))}
    </section>
  );
};

export default UsersGrid;