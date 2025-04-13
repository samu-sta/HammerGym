import { FaCalendarAlt, FaUsers, FaFire } from 'react-icons/fa';
import ClassItem from '../../../common/ClassItem';
import InfoChip from '../../../common/InfoChip';
import ScheduleDay from '../../../common/ScheduleDay';
import { getDifficultyClass } from '../../../../utils/classUtils';

const TrainerClassItem = ({ classData }) => {
  const renderInfoChips = ({ classData }) => (
    <>
      <InfoChip icon={FaUsers}>
        {classData.currentCapacity || 0}/{classData.maxCapacity || 0} alumnos
      </InfoChip>

      <InfoChip icon={FaCalendarAlt}>
        {new Date(classData.schedule.startDate).toLocaleDateString()} - {new Date(classData.schedule.endDate).toLocaleDateString()}
      </InfoChip>

      <InfoChip
        icon={FaFire}
        className={`difficulty-chip ${getDifficultyClass(classData.difficulty)}`}
      >
        {classData.difficulty || 'N/A'}
      </InfoChip>
    </>
  );

  return (
    <ClassItem
      classData={classData}
      renderInfoChips={renderInfoChips}
      renderSchedule={true}
      InfoChipComponent={InfoChip}
      ScheduleDayComponent={ScheduleDay}
    />
  );
};

export default TrainerClassItem;