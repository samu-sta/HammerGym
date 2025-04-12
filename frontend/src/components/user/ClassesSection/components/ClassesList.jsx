import ClassItem from './ClassItem';
import '../styles/ClassesList.css';

const ClassesList = ({ classes, setClasses, loading, error, onEnrollmentChange = () => { }, isInSearch = false }) => {
  if (loading) return <p>Cargando clases...</p>;
  if (error) return <p>Error al cargar las clases: {error}</p>;
  if (!classes.length) return <p>No hay clases disponibles</p>;

  return (
    <section className="classes-list">
      {classes.map(classItem => (
        <ClassItem
          key={classItem.id}
          classData={classItem}
          onEnrollmentChange={onEnrollmentChange}
          isInSearch={isInSearch}
          setClasses={setClasses}
        />
      ))}
    </section>
  );
};

export default ClassesList;