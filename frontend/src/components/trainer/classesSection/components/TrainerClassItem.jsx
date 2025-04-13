import { FaCalendarAlt, FaUsers, FaFire, FaTrash } from 'react-icons/fa';
import ClassItem from '../../../common/ClassItem';
import InfoChip from '../../../common/InfoChip';
import ScheduleDay from '../../../common/ScheduleDay';
import useDeleteClass from '../../../../hooks/useDeleteClass';
import useModal from '../../../../hooks/useModal';
import Modal from '../../../common/Modal';
import { getDifficultyClass } from '../../../../utils/classUtils';
import '../styles/TrainerClassItem.css';

const DeleteConfirmation = ({ onConfirm, onCancel, loading, error }) => (
  <div className="delete-confirmation">
    <p>¿Estás seguro de eliminar esta clase?</p>
    <div className="confirmation-buttons">
      <button
        className="confirm-button"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Eliminando...' : 'Confirmar'}
      </button>
      <button
        className="cancel-button"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </button>
    </div>
    {error && <p className="error-message">{error}</p>}
  </div>
);

const TrainerClassItem = ({ classData, onClassDeleted }) => {
  const { deleteClass, loading, error } = useDeleteClass();
  const { isOpen, openModal, closeModal } = useModal();

  const handleDelete = async () => {
    if (loading) return;

    const success = await deleteClass(classData.id, onClassDeleted);
    if (success) {
      closeModal();
    }
  };

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

  const renderFooter = () => (
    <div className="class-actions">
      <button
        className="delete-button"
        onClick={openModal}
        title="Eliminar clase"
      >
        <FaTrash /> Eliminar
      </button>
    </div>
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
        isOpen={isOpen}
        onClose={closeModal}
        title="Confirmar eliminación"
      >
        <DeleteConfirmation
          onConfirm={handleDelete}
          onCancel={closeModal}
          loading={loading}
          error={error}
        />
      </Modal>
    </>
  );
};

export default TrainerClassItem;