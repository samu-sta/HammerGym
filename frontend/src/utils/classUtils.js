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

/**
 * Checks if today is a scheduled day for a class
 * @param {Object} classData - Class data with schedule information
 * @returns {boolean} True if today is a scheduled day for the class
 */
export const isClassScheduledForToday = (classData) => {
  if (!classData?.schedule?.scheduleDays) {
    return false;
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDay = daysOfWeek[currentDate.getDay()];

  const startDate = new Date(classData.schedule.startDate);
  const endDate = new Date(classData.schedule.endDate);

  // Check if current date is within schedule range
  if (currentDate < startDate || currentDate > endDate) {
    return false;
  }

  // Check if current day is a scheduled day
  return classData.schedule.scheduleDays.some(
    scheduledDay => scheduledDay.day === currentDay
  );
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} Fecha actual formateada
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Filtra los usuarios que tienen asistencia confirmada
 * @param {Array} users - Lista de usuarios con su estado de asistencia
 * @returns {Array} Lista de usuarios que asistieron
 */
export const filterAttendingUsers = (users) => {
  if (!users || !Array.isArray(users)) return [];

  return users
    .filter(user => user.attendance === true)
    .map(user => ({ username: user.username }));
};

/**
 * Valida si una fecha es válida para registrar asistencia
 * @param {string} date - Fecha a validar (YYYY-MM-DD)
 * @param {Object} classData - Datos de la clase
 * @returns {Object} Resultado de la validación {valid, message}
 */
export const validateAttendanceDate = (date, classData) => {
  if (!classData) {
    return {
      valid: false,
      message: 'No hay datos de clase disponibles'
    };
  }

  const selectedDate = new Date(date);
  const today = new Date();

  // Verificar que la fecha no sea futura
  if (selectedDate > today) {
    return {
      valid: false,
      message: 'No puedes registrar asistencia para fechas futuras'
    };
  }

  // Si hay fechas de inicio y fin de la clase, verificar que la fecha esté dentro del rango
  if (classData.schedule?.startDate && classData.schedule?.endDate) {
    const startDate = new Date(classData.schedule.startDate);
    const endDate = new Date(classData.schedule.endDate);

    if (selectedDate < startDate) {
      return {
        valid: false,
        message: 'La fecha seleccionada es anterior al inicio de la clase'
      };
    }

    if (selectedDate > endDate) {
      return {
        valid: false,
        message: 'La fecha seleccionada es posterior al fin de la clase'
      };
    }
  }

  return { valid: true, message: '' };
};