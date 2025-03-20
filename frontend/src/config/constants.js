import { FaUserGraduate } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUserSecret } from "react-icons/fa6";
export const MOBILE_WIDTH = 950;

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
  Sunday: 'Domingo'
};
