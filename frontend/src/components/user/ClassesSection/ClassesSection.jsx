import { useState } from 'react';
import ClassesList from './components/ClassesList';
import useClasses from '../../../hooks/useClasses';
import './styles/ClassesSection.css';

const ClassesSection = () => {
  const [view, setView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { classes: allClasses, loading: allLoading, error: allError } = useClasses('all');
  const { classes: userClasses, loading: userLoading, error: userError } = useClasses('user');

  const filteredAllClasses = allClasses.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserClasses = userClasses.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="classes-container">
      <nav className="class-selector">
        <ul>
          <li>
            <button
              onClick={() => setView('all')}
              className={view === 'all' ? 'active' : ''}
            >
              Buscador
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('user')}
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
          loading={allLoading}
          error={allError}
        />
      ) : (
        <ClassesList
          classes={filteredUserClasses}
          loading={userLoading}
          error={userError}
        />
      )}
    </section>
  );
};

export default ClassesSection;