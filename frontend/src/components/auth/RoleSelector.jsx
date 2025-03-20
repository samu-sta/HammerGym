import './styles/RoleSelector.css';

const RoleSelector = ({ role, setRole }) => (
  <section className="form-group">
    <label htmlFor="role">Rol:</label>
    <section className="custom-select">
      <article
        className={`custom-select-option ${role === 'user' ? 'selected' : ''}`}
        onClick={() => setRole('user')}
      >
        Usuario
      </article>
      <article
        className={`custom-select-option ${role === 'trainer' ? 'selected' : ''}`}
        onClick={() => setRole('trainer')}
      >
        Entrenador
      </article>
    </section>
  </section>
);

export default RoleSelector;