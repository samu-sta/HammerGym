import React from 'react';
import { FaCalendarDay, FaComment } from 'react-icons/fa';
import { difficultyLabels, getDifficultyColor } from '../../../../config/constants';
import '../styles/ProgressList.css';

const ProgressList = ({ progressData }) => {
  // Función para agrupar los datos por mes
  const groupByMonth = (data) => {
    const grouped = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(item);
    });

    return grouped;
  };

  // Función para formatear la fecha en un formato legible
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Función para mapear el nivel de dificultad a su texto
  const mapDifficultyToText = (difficulty) => {
    const index = ['reallyEasy', 'easy', 'medium', 'hard', 'reallyHard'].indexOf(difficulty);
    return index !== -1 ? difficultyLabels[index] : 'Desconocido';
  };

  const groupedData = groupByMonth(progressData);

  return (
    <div className="progress-list-container">
      {Object.keys(groupedData).length === 0 ? (
        <div className="no-progress-entries">
          <p>No hay entradas de progreso para mostrar.</p>
        </div>
      ) : (
        Object.entries(groupedData).map(([month, entries]) => (
          <div key={month} className="month-group">
            <h3 className="month-header">{month}</h3>
            <div className="progress-entries">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="progress-entry"
                  style={{ borderLeft: `4px solid ${getDifficultyColor(entry.howWasIt)}` }}
                >
                  <div className="entry-header">
                    <div className="entry-date">
                      <FaCalendarDay className="entry-icon" />
                      {formatDate(entry.date)}
                    </div>
                    <div
                      className="difficulty-badge"
                      style={{
                        backgroundColor: `${getDifficultyColor(entry.howWasIt)}20`,
                        color: getDifficultyColor(entry.howWasIt)
                      }}
                    >
                      {mapDifficultyToText(entry.howWasIt)}
                    </div>
                  </div>

                  {entry.observations && (
                    <div className="entry-observations">
                      <FaComment className="observation-icon" />
                      <p>{entry.observations}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProgressList;