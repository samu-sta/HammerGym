import React, { useState } from 'react';
import useCreateClass from '../../../../hooks/useCreateClass';
import '../styles/CreateClassForm.css';
import { FaCheck, FaTimes, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const CreateClassForm = ({ onSuccess, onClose }) => {
  const { createClass, loading, error, success, fieldErrors } = useCreateClass(onSuccess);
  const [selectedDays, setSelectedDays] = useState({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const formattedToday = (() => {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  })();

  const handleSubmit = (e) => {
    createClass(e);
  };

  // Función para verificar si hay errores relacionados con los horarios de un día específico
  const getTimeError = (day) => {
    const errorKey = 'schedule.scheduleDays';
    if (fieldErrors[errorKey] && fieldErrors[errorKey].includes(day)) {
      return fieldErrors[errorKey];
    }
    return null;
  };

  return (
    <form className="create-class-form" onSubmit={handleSubmit}>
      <section className="form-group-create-class">
        <label htmlFor="name">Nombre de la Clase</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ej: Yoga Principiantes"
          className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
        />
        {fieldErrors.name ? (
          <aside className="field-error">
            {fieldErrors.name}
          </aside>
        ) : (
          <aside className="field-error" />
        )}
      </section>

      <section className="form-group-create-class">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          placeholder="Descripción detallada de la clase"
          className={`form-input form-textarea ${fieldErrors.description ? 'input-error' : ''}`}
          rows="3"
        ></textarea>
        {fieldErrors.description ? (
          <aside className="field-error">
            {fieldErrors.description}
          </aside>
        ) : (
          <aside className="field-error" />
        )}
      </section>

      <section className="form-row">
        <section className="form-group-create-class">
          <label htmlFor="maxCapacity">Capacidad Máxima</label>
          <input
            type="text"
            id="maxCapacity"
            name="maxCapacity"
            placeholder="Número máximo de alumnos"
            className={`form-input ${fieldErrors.maxCapacity ? 'input-error' : ''}`}
          />
          {fieldErrors.maxCapacity ? (
            <aside className="field-error">
              {fieldErrors.maxCapacity}
            </aside>
          ) : (
            <aside className="field-error" />
          )}
        </section>

        <section className="form-group-create-class">
          <label htmlFor="difficulty">Dificultad</label>
          <select
            id="difficulty"
            name="difficulty"
            className={`form-input form-select ${fieldErrors.difficulty ? 'input-error' : ''}`}
          >
            <option value="">Seleccionar dificultad</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          {fieldErrors.difficulty ? (
            <aside className="field-error">
              {fieldErrors.difficulty}
            </aside>
          )
            : (
              <aside className="field-error" />
            )}
        </section>
      </section>

      <section className="form-row">
        <section className="form-group-create-class">
          <label htmlFor="startDate">
            <FaCalendarAlt /> Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            min={formattedToday}
            className={`form-input ${fieldErrors['schedule.startDate'] ? 'input-error' : ''}`}
          />
          {fieldErrors['schedule.startDate'] ? (
            <aside className="field-error">
              {fieldErrors['schedule.startDate']}
            </aside>
          ) : (
            <aside className="field-error" />
          )}
        </section>

        <section className="form-group-create-class">
          <label htmlFor="endDate">
            <FaCalendarAlt /> Fecha de Finalización
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            min={formattedToday}
            className={`form-input ${fieldErrors['schedule.endDate'] ? 'input-error' : ''}`}
          />
          {fieldErrors['schedule.endDate'] ? (
            <aside className="field-error">
              {fieldErrors['schedule.endDate']}
            </aside>
          ) : (
            <aside className="field-error" />
          )}
        </section>
      </section>

      <fieldset className="schedule-fieldset">
        <legend>Días y Horarios</legend>

        {fieldErrors['schedule.scheduleDays'] ? (
          <aside className="field-error days-error">
            {fieldErrors['schedule.scheduleDays']}
          </aside>
        ) : (
          <aside className="field-error" />
        )}

        <nav className="days-selector">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type="button"
              className={`day-button ${selectedDays[day] ? 'selected' : ''}`}
              onClick={() => handleToggleDay(day)}
            >
              {day}
            </button>
          ))}
        </nav>

        {daysOfWeek.map((day) => (
          selectedDays[day] && (
            <article key={day} className="day-schedule-create-class">
              <h4>{day}</h4>
              <input type="hidden" name={`day_${day}`} value="true" />

              <section className="schedule-row">
                <section className="form-group-create-class time-group">
                  <label>
                    <FaClock /> Hora de Inicio
                  </label>
                  <input
                    type="time"
                    name={`startHour_${day}`}
                    className="form-input"
                  />
                </section>

                <section className="form-group-create-class time-group">
                  <label>
                    <FaClock /> Hora de Finalización
                  </label>
                  <input
                    type="time"
                    name={`endHour_${day}`}
                    className="form-input"
                  />
                </section>
              </section>

              {getTimeError(day) && (
                <aside className="field-error">
                  {getTimeError(day)}
                </aside>
              )}
            </article>
          )
        ))}
      </fieldset>

      {error && <aside className="form-error">{error}</aside>}
      {success && (
        <aside className="form-success">
          <FaCheck /> ¡Clase creada con éxito!
        </aside>
      )}

      <footer className="form-actions">
        <button
          type="button"
          className="btn btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          <FaTimes /> Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-submit"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Clase'}
        </button>
      </footer>
    </form>
  );
};

export default CreateClassForm;