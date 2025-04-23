import React from 'react';
import GymList from '../components/gym/GymList';
import useGyms from '../hooks/useGyms';
import { FaDumbbell } from 'react-icons/fa';
import './styles/Gimnasios.css';

const Gimnasios = () => {
  const { gyms, loading, error, expandedGym, toggleGymExpansion, getOccupancyClass } = useGyms();

  if (loading) {
    return (
      <main className="page-dark-background" aria-busy="true">
        <section className="gimnasios-container">
          <h1>Gimnasios</h1>
          <figure className="loading" role="status" aria-live="polite">
            <FaDumbbell className="loading-icon" />
            <p>Cargando gimnasios...</p>
          </figure>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-dark-background">
        <section className="gimnasios-container">
          <h1>Gimnasios</h1>
          <article className="error" role="alert">
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
              aria-label="Reintentar cargar gimnasios"
            >
              Reintentar
            </button>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="page-dark-background">
      <section className="gimnasios-container">
        <header className="gimnasios-header">
          <h1>Nuestros Gimnasios</h1>
          <p className="gimnasios-intro">
            Descubre nuestros gimnasios equipados con la mejor tecnología y maquinaria
            para ayudarte a alcanzar tus objetivos fitness.
          </p>
        </header>

        <article className="gimnasios-list-container">
          {gyms && gyms.length > 0 ? (
            <GymList
              gyms={gyms}
              expandedGym={expandedGym}
              toggleGymExpansion={toggleGymExpansion}
              getOccupancyClass={getOccupancyClass}
            />
          ) : (
            <section className="no-gyms" role="status">
              <FaDumbbell className="no-gyms-icon" />
              <p>No hay gimnasios disponibles actualmente.</p>
            </section>
          )}
        </article>
      </section>
    </main>
  );
};

export default Gimnasios;