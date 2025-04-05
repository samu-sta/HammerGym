import React from 'react';
import SeriesItem from './SeriesItem';
import '../styles/SeriesList.css';

const SeriesList = ({ day, exerciseIndex, series, onAddSeries, onRemoveSeries }) => {
  return (
    <section className="series-container">
      <h5 className="series-title">Series</h5>

      <table className="series-table">
        <thead className="series-header">
          <tr>
            <th>#</th>
            <th>Reps</th>
            <th>Peso (kg)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {series.map((serie, seriesIndex) => (
            <SeriesItem
              key={seriesIndex}
              day={day}
              exerciseIndex={exerciseIndex}
              seriesIndex={seriesIndex}
              serie={serie}
              onRemoveSeries={() => onRemoveSeries(seriesIndex)}
              // Solo permitir eliminar si hay más de una serie
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
        Añadir Serie
      </button>
    </section>
  );
};

export default SeriesList;