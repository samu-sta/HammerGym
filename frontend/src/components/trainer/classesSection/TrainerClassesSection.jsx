import { useState } from 'react';
import TrainerClassesList from './components/TrainerClassesList';
import useTrainerClasses from '../../../hooks/useTrainerClasses';
import '../../user/ClassesSection/styles/ClassesSection.css';

const TrainerClassesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    classes,
    loading,
    error
  } = useTrainerClasses();

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="classes-container">
      <input
        type="text"
        placeholder="Buscar clases por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <TrainerClassesList
        classes={filteredClasses}
        loading={loading}
        error={error}
      />
    </section>
  );
};

export default TrainerClassesSection;