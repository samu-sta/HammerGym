/**
 * Utility functions for class components
 */

/**
 * Formats hour string by removing trailing ":00"
 * @param {string} hourString - Hour string to format
 * @returns {string} Formatted hour string
 */
export const formatHour = (hourString) => {
  if (!hourString) return '';
  return hourString.replace(/:00$/, '');
};

/**
 * Converts full day name to abbreviated version
 * @param {string} day - Full day name
 * @returns {string} Abbreviated day name
 */
export const getDayName = (day) => {
  const days = {
    'Lunes': 'LUN',
    'Martes': 'MAR',
    'Miercoles': 'MIÉ',
    'Miércoles': 'MIÉ',
    'Jueves': 'JUE',
    'Viernes': 'VIE',
    'Sabado': 'SÁB',
    'Sábado': 'SÁB',
    'Domingo': 'DOM',
    'Monday': 'MON',
    'Tuesday': 'TUE',
    'Wednesday': 'WED',
    'Thursday': 'THU',
    'Friday': 'FRI',
    'Saturday': 'SAT',
    'Sunday': 'SUN'
  };
  return days[day] || day;
};

/**
 * Gets CSS class name based on difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} CSS class name
 */
export const getDifficultyClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'low':
      return 'difficulty-easy';
    case 'medio':
    case 'medium':
      return 'difficulty-medium';
    case 'high':
      return 'difficulty-hard';
    default:
      return '';
  }
};