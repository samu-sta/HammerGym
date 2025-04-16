import { FaCalendarAlt, FaUsers, FaFire, FaTrash, FaUserCheck } from 'react-icons/fa';
import ClassItem from '../../../common/ClassItem';
import InfoChip from '../../../common/InfoChip';
import ScheduleDay from '../../../common/ScheduleDay';
import useDeleteClass from '../../../../hooks/useDeleteClass';
import useModal from '../../../../hooks/useModal';
import Modal from '../../../common/Modal';
import { getDifficultyClass } from '../../../../utils/classUtils';
import AttendanceModal from './AttendanceModal';
import DeleteConfirmation from './DeleteConfirmation';
import '../styles/TrainerClassItem.css';

const TrainerClassItem = ({ classData, onClassDeleted }) => {
  const { deleteClass, loading, error } = useDeleteClass();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal
  } = useModal();

  const {
    isOpen: isAttendanceOpen,
    openModal: openAttendanceModal,
    closeModal: closeAttendanceModal
  } = useModal();

  const handleDelete = async () => {
    if (loading) return;

    const success = await deleteClass(classData.id, onClassDeleted);
    if (success) {
      closeDeleteModal();
    }
  };

  const renderInfoChips = () => (
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

  const renderFooter = () => (
    <footer className="class-actions">
      <button
        className="attendance-button"
        onClick={openAttendanceModal}
        title="Registrar asistencia"
      >
        <FaUserCheck /> Asistencia
      </button>
      <button
        className="delete-button"
        onClick={openDeleteModal}
        title="Eliminar clase"
      >
        <FaTrash /> Eliminar
      </button>
    </footer>
  );

  return (
    <>
      <ClassItem
        classData={classData}
        renderInfoChips={renderInfoChips}
        renderSchedule={true}
        renderFooter={renderFooter}
        InfoChipComponent={InfoChip}
        ScheduleDayComponent={ScheduleDay}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        title="Confirmar eliminación"
      >
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          loading={loading}
          error={error}
        />
      </Modal>

      <Modal
        isOpen={isAttendanceOpen}
        onClose={closeAttendanceModal}
        title="Registro de Asistencia"
      >
        <AttendanceModal
          classId={classData.id}
          onClose={closeAttendanceModal}
        />
      </Modal>
    </>
  );
};

export default TrainerClassItem;