import React from 'react';
import '../styles/SeriesItem.css';

const SeriesItem = ({ day, exerciseIndex, seriesIndex, onRemoveSeries, canRemove }) => {
  return (
    <tr className="series-row">
      <td className="series-number">{seriesIndex + 1}</td>

      <td className="series-reps">
        <input
          type="number"
          id={`series_${day}_${exerciseIndex}_${seriesIndex}_reps`}
          name={`series_${day}_${exerciseIndex}_${seriesIndex}_reps`}
          defaultValue="10"
          required
          min="1"
          className="form-input series-input"
          aria-label="Repetitions"
        />
      </td>

      <td className="series-weight">
        <input
          type="number"
          id={`series_${day}_${exerciseIndex}_${seriesIndex}_weight`}
          name={`series_${day}_${exerciseIndex}_${seriesIndex}_weight`}
          defaultValue="10"
          required
          min="0"
          step="0.1"
          className="form-input series-input"
          aria-label="Weight"
        />
      </td>

      <td className="series-action">
        <button
          type="button"
          className="remove-button series-button"
          onClick={onRemoveSeries}
          disabled={!canRemove}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default SeriesItem;