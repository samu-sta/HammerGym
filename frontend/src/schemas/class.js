import { z } from 'zod';
import {
  WEEK_DAYS,
  DIFFICULTY_LEVELS,
  CLASS_ERROR_MESSAGES as ERROR,
  TIME_REGEX
} from '../config/classConstants.js';

const scheduleDaySchema = z.object({
  day: z.enum(WEEK_DAYS, {
    errorMap: () => ({ message: ERROR.schedule.scheduleDays.invalidDay })
  }),
  startHour: z.string({
    required_error: ERROR.schedule.scheduleDays.startHour.required
  }).regex(TIME_REGEX, {
    message: ERROR.schedule.scheduleDays.startHour.format
  }),
  endHour: z.string({
    required_error: ERROR.schedule.scheduleDays.endHour.required
  }).regex(TIME_REGEX, {
    message: ERROR.schedule.scheduleDays.endHour.format
  })
}).refine(data => data.startHour < data.endHour, {
  message: ERROR.schedule.scheduleDays.endHour.afterStartHour,
  path: ['endHour']
});

const scheduleSchema = z.object({
  startDate: z.string({
    invalid_type_error: ERROR.schedule.nullStartDate,
    required_error: ERROR.schedule.nullStartDate
  }).min(1, ERROR.schedule.startDate),
  endDate: z.string({
    invalid_type_error: ERROR.schedule.nullEndDate,
    required_error: ERROR.schedule.nullEndDate
  }).min(1, ERROR.schedule.endDate),
  scheduleDays: z.array(scheduleDaySchema).min(1, ERROR.schedule.scheduleDays.required)
}).refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate < endDate;
}, {
  message: ERROR.schedule.invalidRange,
  path: ['endDate']
}).refine(data => {
  // Check if all selected days are within the date range
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Get the day of week for start and end dates (0 = Sunday, 1 = Monday, etc.)
  const startDay = startDate.getDay();
  const endDay = endDate.getDay(); // Fixed variable definition

  // Create a map of days to their index (0-6) for easy comparison
  // JavaScript uses 0 = Sunday, but our app uses Monday first, so adjust the mapping
  const dayMap = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 0
  };

  // Create an array of valid days between start and end date (inclusive)
  const validDays = [];

  // If start and end date are the same day, only that day is valid
  if (startDate.toDateString() === endDate.toDateString()) {
    validDays.push(startDay);
  } else {
    // Handle case when dates span multiple days
    let currentDay = startDay;

    // Add all days between start and end (inclusive) to validDays array
    do {
      validDays.push(currentDay);
      currentDay = (currentDay + 1) % 7; // Move to next day, loop back to Sunday after Saturday
    } while (currentDay !== (endDay + 1) % 7);
  }

  // Check if all selected days are in validDays array
  return data.scheduleDays.every(scheduleDay => {
    const dayIndex = dayMap[scheduleDay.day];
    return validDays.includes(dayIndex);
  });
}, {
  message: ERROR.schedule.scheduleDays.dayOutsideDateRange,
  path: ['scheduleDays']
});

// New refinement to check start/end date day match with selected days
scheduleSchema.refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const selectedDays = data.scheduleDays.map(sd => sd.day);

  // Adjust getDay() (Sun=0) to match WEEK_DAYS (Mon=0 index, but value is 'Monday')
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  const selectedDayIndices = selectedDays.map(day => dayMap[day]);

  const startDayIndex = startDate.getDay(); // 0 = Sunday, 1 = Monday, ...
  const endDayIndex = endDate.getDay();

  // Check if start and end dates are the same
  if (startDate.toDateString() === endDate.toDateString()) {
    // If dates are the same, only one day should be selected, and it must match the date's day
    return selectedDayIndices.length === 1 && selectedDayIndices[0] === startDayIndex;
  } else {
    // If dates are different, both start and end date's days must be among the selected days
    return selectedDayIndices.includes(startDayIndex) && selectedDayIndices.includes(endDayIndex);
  }
}, {
  message: ERROR.schedule.scheduleDays.dayMismatchWithDateRange,
  path: ['scheduleDays'] // Apply error to the scheduleDays field
});

export const classSchema = z.object({
  name: z.string()
    .min(3, ERROR.name.min)
    .max(255, ERROR.name.max),
  description: z.string()
    .max(1000, ERROR.description.max)
    .min(1, ERROR.description.required),
  maxCapacity: z.coerce.number({
    invalid_type_error: ERROR.maxCapacity.invalidType,
    required_error: ERROR.maxCapacity.required
  })
    .int(ERROR.maxCapacity.integer)
    .positive(ERROR.maxCapacity.positive)
    .refine(val => val > 0, {
      message: ERROR.maxCapacity.greaterThanZero
    }),
  difficulty: z.enum(Object.values(DIFFICULTY_LEVELS), {
    errorMap: () => ({ message: ERROR.difficulty.invalid })
  }),
  schedule: scheduleSchema
});

/**
 * Genera un mensaje de error para los horarios
 * @param {string} message - Mensaje de error
 * @param {string} day - Día de la semana
 * @returns {Object} Objeto de error formateado
 */
const createTimeError = (message, day) => ({
  success: false,
  error: {
    format: () => ({
      _errors: ['Verifica los horarios seleccionados'],
      schedule: {
        _errors: [],
        scheduleDays: {
          _errors: [message.replace('{day}', day)]
        }
      }
    })
  }
});

/**
 * Genera un mensaje de error para cuando no hay días seleccionados
 * @returns {Object} Objeto de error formateado
 */
const createNoDaysError = () => ({
  success: false,
  error: {
    format: () => ({
      _errors: [ERROR.schedule.scheduleDays.daySelection],
      schedule: {
        _errors: [],
        scheduleDays: {
          _errors: [ERROR.schedule.scheduleDays.required]
        }
      }
    })
  }
});

/**
 * Valida los datos del formulario de clase
 * @param {FormData} formData - Datos del formulario
 * @returns {Object} Resultado de la validación
 */
export const validateCreateClass = (formData) => {
  try {
    const scheduleDays = processScheduleDays(formData);

    // Si hay un error en los días de horario, retornar el error
    if (scheduleDays.error) {
      return scheduleDays.error;
    }

    // Verificar que se haya seleccionado al menos un día
    if (scheduleDays.days.length === 0) {
      return createNoDaysError();
    }

    const classData = {
      name: formData.get('name'),
      description: formData.get('description'),
      maxCapacity: formData.get('maxCapacity'),
      difficulty: formData.get('difficulty'),
      schedule: {
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        scheduleDays: scheduleDays.days
      }
    };

    return classSchema.safeParse(classData);
  } catch (error) {
    return {
      success: false,
      error: {
        format: () => ({ _errors: ['Error al procesar el formulario'] })
      }
    };
  }
};

/**
 * Procesa los días de horario del formulario
 * @param {FormData} formData - Datos del formulario
 * @returns {Object} Días procesados o error
 */
function processScheduleDays(formData) {
  const scheduleDays = [];
  let error = null;

  for (const day of WEEK_DAYS) {
    if (formData.get(`day_${day}`)) {
      const startHour = formData.get(`startHour_${day}`);
      const endHour = formData.get(`endHour_${day}`);

      // Verificar que ambas horas estén definidas
      if (!startHour && !endHour) {
        error = createTimeError(ERROR.schedule.scheduleDays.missingTime, day);
        break;
      } else if (!startHour) {
        error = createTimeError(ERROR.schedule.scheduleDays.missingStartTime, day);
        break;
      } else if (!endHour) {
        error = createTimeError(ERROR.schedule.scheduleDays.missingEndTime, day);
        break;
      }

      const processedStartHour = processTimeFormat(startHour);
      const processedEndHour = processTimeFormat(endHour);

      // Verificar que la hora de fin sea posterior a la de inicio
      if (processedStartHour >= processedEndHour) {
        error = createTimeError(ERROR.schedule.scheduleDays.invalidTimeRange, day);
        break;
      }

      scheduleDays.push({
        day,
        startHour: processedStartHour,
        endHour: processedEndHour
      });
    }
  }

  return { days: scheduleDays, error };
}

/**
 * Asegura que el formato de hora tenga segundos
 * @param {string} time - Hora en formato HH:MM o HH:MM:SS
 * @returns {string} Hora en formato HH:MM:SS
 */
function processTimeFormat(time) {
  if (time && !time.includes(':00', time.lastIndexOf(':'))) {
    return `${time}:00`;
  }
  return time;
}