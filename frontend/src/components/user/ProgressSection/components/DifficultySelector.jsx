import React from 'react';
import '../styles/DifficultySelector.css';
import { FaGrinBeam, FaSmile, FaMeh, FaFrown, FaSadTear } from 'react-icons/fa';
import { useIsMobile } from '../../../../hooks/useWindowSize';

const DIFFICULTY_LEVELS = [
  {
    value: 'reallyEasy',
    label: 'Muy fácil',
    icon: <FaGrinBeam />,
    color: '#4caf50'
  },
  {
    value: 'easy',
    label: 'Fácil',
    icon: <FaSmile />,
    color: '#8bc34a'
  },
  {
    value: 'medium',
    label: 'Normal',
    icon: <FaMeh />,
    color: '#998000'
  },
  {
    value: 'hard',
    label: 'Difícil',
    icon: <FaFrown />,
    color: '#ff9800'
  },
  {
    value: 'reallyHard',
    label: 'Muy difícil',
    icon: <FaSadTear />,
    color: '#f44336'
  }
];

const mobileSize = 450;

const DifficultySelector = ({ difficulty, onChange }) => {
  const isMobile = useIsMobile({ mobileSize });

  return (
    <section className="form-section">
      <label className="section-label">¿Qué tal ha ido tu entrenamiento?</label>
      <main className={`difficulty-slider ${isMobile ? 'mobile' : ''}`}>
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            type="button"
            key={level.value}
            className={`button difficulty-option ${difficulty === level.value ? 'selected' : ''} ${isMobile ? 'mobile' : ''}`}
            onClick={() => onChange(level.value)}
            aria-label={level.label}
          >
            <figure className={`difficulty-icon ${isMobile ? 'mobile' : ''}`}
              style={{ color: level.color }}>
              {level.icon}
            </figure>
            <span className={`difficulty-label ${isMobile ? 'mobile' : ''}`}>
              {level.label}
            </span>
          </button>
        ))}
      </main>
    </section>
  );
};

export default DifficultySelector;