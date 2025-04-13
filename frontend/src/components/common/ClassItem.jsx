import { FaUser, FaCalendarAlt, FaUsers, FaFire } from 'react-icons/fa';
import './styles/ClassItem.css';

const ClassItem = ({
  classData,
  renderInfoChips,
  renderSchedule,
  renderFooter,
  InfoChipComponent,
  ScheduleDayComponent,
  additionalClassName = ''
}) => {
  // Check if schedule exists before rendering date info
  const hasSchedule = classData.schedule !== null && classData.schedule !== undefined;
  const hasScheduleDays = hasSchedule && classData.schedule.scheduleDays && classData.schedule.scheduleDays.length > 0;

  return (
    <article className={`class-item ${additionalClassName}`}>
      <header>
        <h3 className="class-title">
          {classData.name}
        </h3>
      </header>

      <p>{classData.description}</p>

      <section className="class-info">
        {renderInfoChips({ classData, hasSchedule, InfoChipComponent })}
      </section>

      {hasScheduleDays && renderSchedule && (
        <section className="class-schedule">
          <ul className="schedule-days-grid">
            {classData.schedule.scheduleDays.map((day, index) => (
              <ScheduleDayComponent
                key={index}
                day={day.day}
                startHour={day.startHour}
                endHour={day.endHour}
              />
            ))}
          </ul>
        </section>
      )}

      {renderFooter && renderFooter(classData)}
    </article>
  );
};

export default ClassItem;