import React from 'react';

const FilterPills = ({ activeFilter, onFilterChange, filters, isMobile }) => {
  return (
    <div className='filter-pills'>
      <button
        className={`pill ${activeFilter === filters.MONTH ? 'active' : ''}`}
        onClick={() => onFilterChange(filters.MONTH)}
        style={{ minWidth: isMobile ? '60px' : '80px' }}
      >
        30 días
      </button>
      <button
        className={`pill ${activeFilter === filters.WEEK ? 'active' : ''}`}
        onClick={() => onFilterChange(filters.WEEK)}
        style={{ minWidth: isMobile ? '60px' : '80px' }}
      >
        7 días
      </button>
    </div>
  );
};

export default React.memo(FilterPills);