import React from 'react';
import { FaHistory, FaSync } from 'react-icons/fa';
import './styles/ActivitiesSection.css';
import ActivityDay from './ActivityDay';
import FilterPills from './FilterPills';
import StatusMessage from './StatusMessage';
import useUserActivities from '../../../hooks/useUserActivities';
import { useIsMobile } from '../../../hooks/useWindowSize';

const ActivitiesSection = () => {
  const isMobile = useIsMobile({ mobileSize: 500 });

  const {
    filteredActivities,
    groupedActivities,
    loading,
    refreshing,
    error,
    timeFilter,
    expandedDay,
    loadActivities,
    toggleDay,
    handleFilterChange,
    TIME_FILTERS
  } = useUserActivities();

  return (
    <section className='activities-section'>
      <header className={`activities-header ${isMobile ? 'mobile' : ''}`}>
        <h2>
          <FaHistory className='header-icon' />
          Actividades
        </h2>

        <section className={`actions ${isMobile ? 'mobile' : ''}`}>
          <FilterPills
            activeFilter={timeFilter}
            onFilterChange={handleFilterChange}
            filters={TIME_FILTERS}
            isMobile={isMobile}
          />

          <button
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={loadActivities}
            disabled={refreshing}
            aria-label="Refrescar actividades"
          >
            <FaSync />
          </button>
        </section>
      </header>

      <main className='activities-body'>
        {loading && !refreshing ? (
          <StatusMessage type="loading" />
        ) : error ? (
          <StatusMessage type="error" message={error} />
        ) : filteredActivities.length === 0 ? (
          <StatusMessage
            type="empty"
            timeFilter={timeFilter}
            filters={TIME_FILTERS}
          />
        ) : (
          <ul className='activity-timeline'>
            {groupedActivities.map((group) => (
              <ActivityDay
                key={group.date.toISOString()}
                dayGroup={group}
                isExpanded={expandedDay === group.date.toDateString()}
                onToggle={() => toggleDay(group.date.toDateString())}
                isMobile={isMobile}
              />
            ))}
          </ul>
        )}
      </main>
    </section>
  );
};

export default ActivitiesSection;