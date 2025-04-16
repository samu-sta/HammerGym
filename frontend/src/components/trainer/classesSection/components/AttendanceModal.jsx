import { FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import useAttendance from '../../../../hooks/useAttendance';
import './styles/AttendanceModal.css';

const AttendanceModal = ({ classId, onClose }) => {
  const {
    loading,
    error,
    dateError,
    success,
    attendingUsers,
    users,
    classData,
    selectedDate,
    toggleUserAttendance,
    submitAttendance,
    validateDate,
    changeSelectedDate
  } = useAttendance(classId);

  const handleDateChange = (e) => {
    changeSelectedDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (classData) {
      const isValidDate = validateDate(selectedDate, classData);
      if (!isValidDate.valid) {
        return;
      }
    }

    const result = await submitAttendance(selectedDate);
    if (result) {
      setTimeout(onClose, 750);
    }
  };

  const isUserAttending = (username) =>
    attendingUsers.some(user => user.username === username);

  if (loading && users.length === 0 && !classData) {
    return <section className="attendance-loading"><p>Cargando datos...</p></section>;
  }

  return (
    <article className="attendance-container">
      {success && <aside className="attendance-success"><p>Asistencia registrada correctamente</p></aside>}

      <header className="date-selector">
        <label htmlFor="attendance-date">
          <FaCalendarAlt /> Fecha de asistencia:
        </label>
        <input
          type="date"
          id="attendance-date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-input"
        />
      </header>

      <main className="attendance-content">
        <section className="attendance-users">
          {error || dateError ? (
            <p className="attendance-error">{error || dateError}</p>
          ) : (
            <>
              <h3>Usuarios de la clase</h3>
              {users.length === 0 ? (
                <p className="no-users">No hay usuarios inscritos en esta clase</p>
              ) : (
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.username} className="user-row">
                        <td>{user.username}</td>
                        <td>
                          <button
                            className={`attendance-toggle ${isUserAttending(user.username) ? 'attending' : ''}`}
                            onClick={() => toggleUserAttendance(user.username)}
                          >
                            {isUserAttending(user.username) ? <FaCheck /> : <FaTimes />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="attendance-actions">
        <button className="btn cancel-button-attendance" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button
          className="btn confirm-button-attendance"
          onClick={handleSubmit}
          disabled={loading || error || dateError}
        >
          {loading ? 'Registrando...' : 'Confirmar Asistencia'}
        </button>
      </footer>
    </article>
  );
};

export default AttendanceModal;