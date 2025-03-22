import React from 'react';
import '../styles/ObservationsField.css';

const ObservationsField = ({ value, onChange }) => {
  return (
    <div className="form-section">
      <label htmlFor="observations" className="section-label">
        Observaciones <span className="label-optional">(opcional)</span>
      </label>
      <textarea
        id="observations"
        name="observations"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Añade cualquier comentario sobre tu entrenamiento..."
        rows={3}
      ></textarea>
    </div>
  );
};

export default ObservationsField;