import React from 'react';
import '../styles/SeriesItem.css';
import FormField from '../../../auth/FormField';
const SeriesItem = ({ day, exerciseIndex, seriesIndex, onRemoveSeries, canRemove }) => {
  return (
    <article className="series-row">
      <FormField
        label="Reps"
        type="number"
        name={`series_${day}_${exerciseIndex}_${seriesIndex}_reps`}
        defaultValue="10"
        required
        min="1"
        className="form-input"
      />

      <FormField
        label="Weight"
        type="number"
        name={`series_${day}_${exerciseIndex}_${seriesIndex}_weight`}
        defaultValue="10"
        required
        min="0"
        step="0.1"
        className="form-input"
      />
      <button
        type="button"
        className="remove-button"
        onClick={onRemoveSeries}
        disabled={!canRemove}
      >
        Remove
      </button>
    </article>
  );
};

export default SeriesItem;