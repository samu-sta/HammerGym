import TrainerClassItem from './TrainerClassItem';
import ClassesList from '../../../common/ClassesList';

const TrainerClassesList = ({ classes, loading, error, onClassDeleted }) => {
  const renderItem = (classItem) => (
    <TrainerClassItem
      key={classItem.id}
      classData={classItem}
      onClassDeleted={onClassDeleted}
    />
  );

  return (
    <ClassesList
      classes={classes}
      loading={loading}
      error={error}
      renderItem={renderItem}
    />
  );
};

export default TrainerClassesList;