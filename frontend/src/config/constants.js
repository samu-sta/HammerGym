import { FaUserGraduate } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUserSecret } from "react-icons/fa6";

export const DEFAULT_MOBILE_WIDTH = 950;

export const PERSONAL = [
  {
    name: 'Usuario',
    actions: [
      'Consulta de ejercicios',
      'Consulta de clases',
      'Registro de actividades',
      'Consulta de resultados'
    ],
    icon: FaUser,
    delay: 0
  },
  {
    name: 'Entrenador',
    actions: [
      'Creación de ejercicios',
      'Seguimiento de rutinas',
      'Consulta de resultados',
      'Gestión de clases'
    ],
    icon: FaUserGraduate,
    delay: 200
  },
  {
    name: 'Administrador',
    actions: [
      'Gestión de usuarios',
      'Gestión de entrenadores',
      'Gestión de espacios',
      'Gestión de membresias'
    ],
    icon: FaUserSecret,
    delay: 400
  }
];

export const FORM_ERROR_MESSAGES = {
  email: {
    required: 'El email es requerido',
    invalid: 'Dirección de email inválida',
    maxLength: 'El email no puede exceder 255 caracteres'
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: 'La contraseña debe tener al menos 6 caracteres',
    maxLength: 'La contraseña no puede exceder 255 caracteres'
  },
  confirmPassword: {
    required: 'La confirmación de contraseña es requerida',
    minLength: 'La confirmación de contraseña debe tener al menos 6 caracteres',
    mismatch: 'Las contraseñas no coinciden'
  },
  username: {
    required: 'El nombre de usuario es requerido',
    minLength: 'El nombre de usuario debe tener al menos 3 caracteres',
    maxLength: 'El nombre de usuario no puede exceder 255 caracteres'
  },
  realName: {
    required: 'El nombre es requerido',
    minLength: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 'El nombre no puede exceder 255 caracteres'
  },
  lastNames: {
    required: 'Los apellidos son requeridos',
    minLength: 'Los apellidos deben tener al menos 2 caracteres',
    maxLength: 'Los apellidos no pueden exceder 255 caracteres'
  },
  role: {
    invalid: 'Rol inválido'
  },
  server: {
    connection: 'Error de conexión con el servidor',
    registration: 'Error en el registro'
  }
};


export const dayMap = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export const dayNumberMap = {
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
  'sunday': 0
};

const translations = {
  'monday': 'Lunes',
  'tuesday': 'Martes',
  'wednesday': 'Miércoles',
  'thursday': 'Jueves',
  'friday': 'Viernes',
  'saturday': 'Sábado',
  'sunday': 'Domingo',
  'Monday': 'Lunes',
  'Tuesday': 'Martes',
  'Wednesday': 'Miércoles',
  'Thursday': 'Jueves',
  'Friday': 'Viernes',
  'Saturday': 'Sábado',
  'Sunday': 'Domingo'
};

export const translateDay = (day) => {
  return translations[day] || day;
};

export const difficultyLabels = [
  'Muy fácil',
  'Fácil',
  'Normal',
  'Difícil',
  'Muy difícil'
];

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'reallyEasy':
      return '#4caf50'; // Verde
    case 'easy':
      return '#8bc34a'; // Verde claro
    case 'medium':
      return '#998000'; // Amarillo
    case 'hard':
      return '#ff9800'; // Naranja
    case 'reallyHard':
      return '#f44336'; // Rojo
    default:
      return '#607D8B'; // Gris azulado
  }
};

// Mapear dificultad a valor numérico para la gráfica
export const mapDifficultyToNumeric = (difficulty) => {
  switch (difficulty) {
    case 'reallyEasy': return 1;
    case 'easy': return 2;
    case 'medium': return 3;
    case 'hard': return 4;
    case 'reallyHard': return 5;
    default: return 3;
  }
};

export const API_URL = "http://localhost:3000" || import.meta.env.VITE_API_URL;

// User-related constants
export const USER_ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  USER: 'user'
};

// API endpoints
export const ENDPOINTS = {
  USERS: '/user',
  TRAINERS: '/trainer',
  GYMS: '/gym',
  MACHINES: '/machine',
  MACHINE_MODELS: '/machine-model',
  CLASSES: '/classes',
  TRAINING: '/training',
  USER_ACTIVITY: '/user-activity',
  PROGRESS: '/progress',
  MEMBERSHIP: '/membership',
  CONTRACT: '/contract',
  STRIPE: '/stripe'
};

// Contract and membership-related constants
export const CONTRACT_TABS = {
  CONTRACTS: 'contracts',
  MEMBERSHIPS: 'memberships',
  PAYMENT: 'payment'
};

export const CONTRACT_MESSAGES = {
  SELECT_MEMBERSHIP: 'Por favor, selecciona una membresía',
  NO_USER_INFO: 'No hay información de usuario disponible, por favor inicia sesión nuevamente',
  NO_MEMBERSHIP_ID: 'ID de membresía no disponible',
  STRIPE_SESSION_ERROR: 'Error al crear la sesión de pago con Stripe.',
  CONNECTION_ERROR: 'Error al conectar con el servicio de pago: ',
  RENEWAL_SESSION_ERROR: 'Error al crear la sesión de renovación de pago con Stripe.',
  CONTRACT_INFO_ERROR: 'Información del contrato no disponible',
  PAYMENT_PROCESS_ERROR: 'Error al procesar la redirección de pago.'
};

export const URL_PARAMS = {
  SUCCESS: 'success',
  CANCELED: 'canceled',
  RENEWAL: 'renewal',
  CONTRACT_ID: 'contract_id'
};

export const PAYMENT_STATUSES = {
  SUCCESS: 'true'
};

export const STRIPE_URL_DASHBOARD = import.meta.env.VITE_STRIPE_URL || 'https://dashboard.stripe.com';