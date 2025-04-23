import { API_URL } from '../config/constants';

const getAllClasses = async () => {
  try {
    const response = await fetch(`${API_URL}/classes`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return { success: false, classes: [] };
  }
};

const getUserClasses = async () => {
  try {
    const response = await fetch(`${API_URL}/classes/user`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user classes:', error);
    return { success: false, classes: [] };
  }
};

const getTrainerClasses = async () => {
  try {
    const response = await fetch(`${API_URL}/classes/trainer`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trainer classes:', error);
    return { success: false, classes: [] };
  }
};

const createClass = async (classData) => {
  try {
    const response = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating class:', error);
    return { success: false, message: 'Error al crear la clase' };
  }
};

const enrollInClass = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ classId }),
      credentials: 'include'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error enrolling in class');
    }

    return true;
  } catch (error) {
    console.error('Error enrolling in class:', error);
    return false;
  }
};

const unenrollFromClass = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/unenroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ classId }),
      credentials: 'include'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error unenrolling from class');
    }

    return true;
  } catch (error) {
    console.error('Error unenrolling from class:', error);
    return false;
  }
};

const deleteClass = async (classId) => {
  try {
    const response = await fetch(`${API_URL}/classes/${classId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar la clase');
    }

    return { success: true, message: 'Clase eliminada correctamente' };
  } catch (error) {
    console.error('Error eliminando clase:', error);
    return { success: false, message: error.message || 'Error al eliminar la clase' };
  }
};

/**
 * Obtiene los datos de asistencia de una clase para una fecha específica
 * @param {string} classId - ID de la clase
 * @param {string} date - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {Promise<Object>} Datos de la clase y usuarios con su estado de asistencia
 */
const getClassAttendance = async (classId, date) => {
  try {
    const response = await fetch(`${API_URL}/classes/attendance/${classId}&${date}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la asistencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return { success: false, message: error.message, users: [], class: null };
  }
};

/**
 * Registra la asistencia de usuarios a una clase
 * @param {string} classId - ID de la clase 
 * @param {Array} users - Array de objetos con {username} de los usuarios que asistieron
 * @param {string} date - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {Promise<Object>} Resultado de la operación
 */
const submitClassAttendance = async (classId, users, date) => {
  try {
    const response = await fetch(`${API_URL}/classes/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ classId, users, date }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar la asistencia');
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error submitting attendance:', error);
    return { success: false, message: error.message };
  }
};

export {
  getAllClasses,
  getUserClasses,
  getTrainerClasses,
  enrollInClass,
  unenrollFromClass,
  createClass,
  deleteClass,
  getClassAttendance,
  submitClassAttendance
};