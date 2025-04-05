import '../styles/DaySelector.css';

const DaySelector = ({ days, selectedDays, onToggleDay }) => {
  return (
    <section className="day-selection">
      <h3 className="section-title">Select Training Days</h3>
      <nav className="day-buttons">
        {days.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => onToggleDay(day)}
            className={`button day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </nav>
    </section>
  );
};

export default DaySelector;