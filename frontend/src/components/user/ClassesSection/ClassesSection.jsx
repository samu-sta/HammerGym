import { useState, useCallback } from 'react';
import ClassesList from './components/ClassesList';
import useClasses from '../../../hooks/useClasses';
import './styles/ClassesSection.css';

const ClassesSection = () => {
  const [view, setView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    classes: allClasses,
    setClasses: setAllClasses,
    loading: allLoading,
    error: allError
  } = useClasses('all', view);

  const {
    classes: userClasses,
    setClasses: setUserClasses,
    loading: userLoading,
    error: userError
  } = useClasses('user', view);

  const handleViewChange = useCallback((newView) => {
    if (newView !== view) {
      setView(newView);
    }
  }, [view]);

  // Filter out classes that the user is already enrolled in from all classes
  const availableClasses = allClasses.filter(classItem =>
    !userClasses.some(userClass => userClass.id === classItem.id)
  );

  const filteredAllClasses = availableClasses.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserClasses = userClasses.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollmentChange = useCallback(() => {
  }, [view, userClasses]);

  return (
    <section className="classes-container">
      <nav className="class-selector">
        <ul>
          <li>
            <button
              onClick={() => handleViewChange('all')}
              className={view === 'all' ? 'active' : ''}
            >
              Buscador
            </button>
          </li>
          <li>
            <button
              onClick={() => handleViewChange('user')}
              className={view === 'user' ? 'active' : ''}
            >
              Mis Clases
            </button>
          </li>
        </ul>
      </nav>

      <input
        type="text"
        placeholder="Buscar clases por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {view === 'all' ? (
        <ClassesList
          classes={filteredAllClasses}
          setClasses={setAllClasses}
          loading={allLoading}
          error={allError}
          onEnrollmentChange={handleEnrollmentChange}
          isInSearch={true}
        />
      ) : (
        <ClassesList
          classes={filteredUserClasses}
          setClasses={setUserClasses}
          loading={userLoading}
          error={userError}
          onEnrollmentChange={handleEnrollmentChange}
          isInSearch={false}
        />
      )}
    </section>
  );
};

export default ClassesSection;