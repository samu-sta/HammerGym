import React from 'react';
import '../styles/SeriesTable.css';

const SeriesTable = ({ series }) => {
  return (
    <table className="series-table">
      <thead>
        <tr className="series-header">
          <th>Serie</th>
          <th>Reps</th>
          <th>Peso</th>
        </tr>
      </thead>
      <tbody>
        {series.map((serie, serieId) => (
          <tr key={serieId} className="serie-row">
            <td className="serie-number">{serieId + 1}</td>
            <td className="serie-reps">{serie.reps}</td>
            <td className="serie-weight">{serie.weight} kg</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeriesTable;