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
    delay : 0
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
    delay : 200
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
    delay : 400
  }
];