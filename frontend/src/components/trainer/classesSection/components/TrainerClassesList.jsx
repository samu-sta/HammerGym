import TrainerClassItem from './TrainerClassItem';
import ClassesList from '../../../common/ClassesList';

const TrainerClassesList = ({ classes, loading, error }) => {
  const renderItem = (classItem) => (
    <TrainerClassItem
      key={classItem.id}
      classData={classItem}
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