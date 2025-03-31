import React from 'react';
import SeriesItem from './SeriesItem';
import '../styles/SeriesList.css';

const SeriesList = ({ day, exerciseIndex, series, onAddSeries, onRemoveSeries }) => {
  return (
    <section className="series-container">
      <h5 className="series-title">Series</h5>
      
      {series && series.map((_, seriesIndex) => (
        <SeriesItem
          key={seriesIndex}
          day={day}
          exerciseIndex={exerciseIndex}
          seriesIndex={seriesIndex}
          onRemoveSeries={() => onRemoveSeries(seriesIndex)}
          canRemove={series.length > 1}
        />
      ))}

      <button
        type="button"
        className="add-button"
        onClick={onAddSeries}
      >
        Add Series
      </button>
    </section>
  );
};

export default SeriesList;