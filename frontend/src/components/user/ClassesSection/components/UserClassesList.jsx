import UserClassItem from './UserClassItem';
import ClassesList from '../../../common/ClassesList';

const UserClassesList = ({ classes, setClasses, loading, error, onEnrollmentChange = () => { }, isInSearch = false }) => {
  const renderItem = (classItem) => (
    <UserClassItem
      key={classItem.id}
      classData={classItem}
      onEnrollmentChange={onEnrollmentChange}
      isInSearch={isInSearch}
      setClasses={setClasses}
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

export default UserClassesList;