import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { dayMap } from '../../../../config/constants.js';
import useModal from '../../../../hooks/useModal.jsx';
import '../styles/DaySelector.css';

const allWeekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DaySelector = ({ selectedDay, setSelectedDay, days, hasDayTraining }) => {
  const { isOpen, toggleModal, modalRef } = useModal();

  return (
    <section className="day-selector-container">
      <button
        className="button day-selector-toggle"
        onClick={toggleModal}
      >
        <FaCalendarAlt />
        <span>{dayMap[selectedDay] || selectedDay}</span>
        <FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <article className="day-selector-modal" ref={modalRef}>
          {allWeekdays.map(day => (
            <button
              key={day}
              className={`button modal-day-option 
                ${selectedDay === day ? 'selected' : ''}`}
              onClick={() => {
                setSelectedDay(day);
                toggleModal();
              }}
            >
              <span className="day-name">{dayMap[day] || day}</span>
              <span className="day-status">
                {hasDayTraining(day)
                  ? `${days[day].exercises.length} ejercicio${days[day].exercises.length !== 1 ? 's' : ''}`
                  : 'Sin ejercicios asignados'}
              </span>
            </button>
          ))}
        </article>
      )}
    </section>
  );
};

export default DaySelector;