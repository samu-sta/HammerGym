import React from 'react';
import SeriesItem from './SeriesItem';
import '../styles/SeriesList.css';

const SeriesList = ({ day, exerciseIndex, series, onAddSeries, onRemoveSeries }) => {
  return (
    <>
      <table className="series-table">
        <thead>
          <tr className="series-header">
            <th>Serie</th>
            <th>Reps</th>
            <th>Weight (kg)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>

      <button
        type="button"
        className="add-button"
        onClick={onAddSeries}
      >
        Add Series
      </button>
    </>
  );
};

export default SeriesList;