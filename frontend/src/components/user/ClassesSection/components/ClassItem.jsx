import { FaUser, FaCalendarAlt, FaUsers, FaFire, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import '../styles/ClassItem.css';
import InfoChip from './InfoChip';
import ScheduleDay from './ScheduleDay';
import useClassEnrollment from '../../../../hooks/useClassEnrollment';
import { useState } from 'react';

const ClassItem = ({ classData, setClasses, onEnrollmentChange, isInSearch = false }) => {
  const { enroll, unenroll, loading } = useClassEnrollment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'low':
        return 'difficulty-easy';
      case 'medio':
      case 'medium':
        return 'difficulty-medium';
      case 'high':
        return 'difficulty-hard';
      default:
        return '';
    }
  };

  const formatHour = (hourString) => {
    if (!hourString) return '';
    return hourString.replace(/:00$/, '');
  };

  const getDayName = (day) => {
    const days = {
      'Lunes': 'LUN',
      'Martes': 'MAR',
      'Miercoles': 'MIÉ',
      'Miércoles': 'MIÉ',
      'Jueves': 'JUE',
      'Viernes': 'VIE',
      'Sabado': 'SÁB',
      'Sábado': 'SÁB',
      'Domingo': 'DOM',
      'Monday': 'MON',
      'Tuesday': 'TUE',
      'Wednesday': 'WED',
      'Thursday': 'THU',
      'Friday': 'FRI',
      'Saturday': 'SAT',
      'Sunday': 'SUN'
    };
    return days[day] || day;
  };

  const handleEnrollmentChange = async (action) => {
    setIsProcessing(true);
    const success = await action(classData.id);
    setIsProcessing(false);
    if (!success) return;

    setIsHidden(true);
    if (onEnrollmentChange) {
      onEnrollmentChange(classData.id);
    }
    setClasses(prevClasses => prevClasses.filter(cls => cls.id !== classData.id));
  };

  const handleEnroll = () => handleEnrollmentChange(enroll);
  const handleUnenroll = () => handleEnrollmentChange(unenroll);

  const isEnrolled = classData.SignedUpIn !== undefined;
  const isClassFull = classData.currentCapacity >= classData.maxCapacity;

  if (isHidden) return null;

  return (
    <article className="class-item">
      <header>
        <h3 className="class-title">
          {classData.name}
        </h3>
      </header>

      <p>{classData.description}</p>

      <section className="class-info">
        <InfoChip icon={FaUser}>
          {classData.trainer.account.username}
        </InfoChip>

        <InfoChip icon={FaUsers}>
          {classData.currentCapacity}/{classData.maxCapacity}
        </InfoChip>

        <InfoChip icon={FaCalendarAlt}>
          {new Date(classData.schedule.startDate).toLocaleDateString()} - {new Date(classData.schedule.endDate).toLocaleDateString()}
        </InfoChip>

        <InfoChip
          icon={FaFire}
          className={`difficulty-chip ${getDifficultyClass(classData.difficulty)}`}
        >
          {classData.difficulty}
        </InfoChip>
      </section>

      <section className="class-schedule">
        <ul className="schedule-days-grid">
          {classData.schedule.scheduleDays.map((day, index) => (
            <ScheduleDay
              key={index}
              day={day.day}
              startHour={day.startHour}
              endHour={day.endHour}
              formatHour={formatHour}
              getDayName={getDayName}
            />
          ))}
        </ul>
      </section>
      {isEnrolled && (
        <InfoChip icon={FaCalendarAlt}>
          Inscrito desde: {new Date(classData.SignedUpIn).toLocaleDateString()}
        </InfoChip>
      )}

      {isEnrolled ? (
        <footer className='class-item-footer'>
          {!isInSearch && (
            <button
              className="unenroll-button"
              onClick={handleUnenroll}
              disabled={isProcessing || loading}
            >
              <FaUserMinus /> Cancelar inscripción
            </button>
          )}
        </footer>
      ) : (
        isInSearch && (
          <footer className='class-item-footer'>
            <button
              className="enroll-button"
              onClick={handleEnroll}
              disabled={isProcessing || loading || isClassFull}
            >
              <FaUserPlus /> {isClassFull ? "Clase llena" : "Inscribirse"}
            </button>
          </footer>
        )
      )}
    </article>
  );
};

export default ClassItem;