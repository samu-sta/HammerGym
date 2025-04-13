import './styles/ClassesList.css';

const ClassesList = ({
  classes,
  loading,
  error,
  noClassesMessage = "No hay clases disponibles",
  loadingMessage = "Cargando clases...",
  renderItem
}) => {
  if (loading) return <p>{loadingMessage}</p>;
  if (error) return <p>Error al cargar las clases: {error}</p>;
  if (!classes.length) return <p>{noClassesMessage}</p>;

  return (
    <section className="classes-list">
      {classes.map(classItem => renderItem(classItem))}
    </section>
  );
};

export default ClassesList;