import { FaUser, FaCalendarAlt, FaUsers, FaFire, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import '../styles/ClassItem.css';
import useClassEnrollment from '../../../../hooks/useClassEnrollment';
import { useState } from 'react';
import { getDifficultyClass } from '../../../../utils/classUtils';
import ClassItem from '../../../common/ClassItem';
import InfoChip from '../../../common/InfoChip';
import ScheduleDay from '../../../common/ScheduleDay';

const UserClassItem = ({ classData, setClasses, onEnrollmentChange, isInSearch = false }) => {
  const { enroll, unenroll, loading } = useClassEnrollment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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

  const renderInfoChips = ({ classData, hasSchedule }) => (
    <>
      <InfoChip icon={FaUser}>
        {classData.trainer.account.username}
      </InfoChip>

      <InfoChip icon={FaUsers}>
        {classData.currentCapacity}/{classData.maxCapacity}
      </InfoChip>

      {hasSchedule && (
        <InfoChip icon={FaCalendarAlt}>
          {new Date(classData.schedule.startDate).toLocaleDateString()} - {new Date(classData.schedule.endDate).toLocaleDateString()}
        </InfoChip>
      )}

      <InfoChip
        icon={FaFire}
        className={`difficulty-chip ${getDifficultyClass(classData.difficulty)}`}
      >
        {classData.difficulty}
      </InfoChip>
    </>
  );

  const renderFooter = (classData) => {
    const isEnrolled = classData.SignedUpIn !== undefined;

    return (
      <>
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
      </>
    );
  };

  return (
    <ClassItem
      classData={classData}
      renderInfoChips={renderInfoChips}
      renderSchedule={true}
      renderFooter={renderFooter}
      InfoChipComponent={InfoChip}
      ScheduleDayComponent={ScheduleDay}
    />
  );
};

export default UserClassItem;