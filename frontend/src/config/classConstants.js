export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const DIFFICULTY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const CLASS_ERROR_MESSAGES = {
  name: {
    min: 'El nombre debe tener al menos 3 caracteres',
    max: 'El nombre no puede exceder los 255 caracteres'
  },
  description: {
    required: 'La descripción es requerida',
    max: 'La descripción no puede exceder los 1000 caracteres'
  },
  maxCapacity: {
    invalidType: 'La capacidad máxima debe ser un número',
    required: 'La capacidad máxima es requerida',
    integer: 'La capacidad máxima debe ser un número entero',
    positive: 'La capacidad máxima debe ser positiva',
    greaterThanZero: 'La capacidad máxima debe ser mayor a cero'
  },
  difficulty: {
    invalid: 'Debe seleccionar una dificultad válida'
  },
  schedule: {
    startDate: 'La fecha de inicio es requerida',
    endDate: 'La fecha de fin es requerida',
    nullStartDate: 'Por favor, seleccione una fecha de inicio para la clase',
    nullEndDate: 'Por favor, seleccione una fecha de finalización para la clase',
    invalidRange: 'La fecha de fin debe ser posterior a la fecha de inicio',
    scheduleDays: {
      required: 'Debe seleccionar al menos un día de la semana',
      daySelection: 'Debes seleccionar al menos un día',
      invalidDay: 'Debes seleccionar un día válido',
      startHour: {
        required: 'La hora de inicio es requerida',
        format: 'Formato de hora inválido. Debe ser HH:MM o HH:MM:SS'
      },
      endHour: {
        required: 'La hora de fin es requerida',
        format: 'Formato de hora inválido. Debe ser HH:MM o HH:MM:SS',
        afterStartHour: 'La hora de fin debe ser posterior a la hora de inicio'
      },
      missingTime: 'Debe ingresar las horas de inicio y fin para {day}',
      missingStartTime: 'Debe ingresar la hora de inicio para {day}',
      missingEndTime: 'Debe ingresar la hora de fin para {day}',
      invalidTimeRange: 'En {day} la hora de fin debe ser posterior a la de inicio'
    }
  }
};

export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;