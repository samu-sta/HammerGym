const getAllClasses = async () => {
  try {
    const response = await fetch('http://localhost:3000/classes', {
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
    const response = await fetch('http://localhost:3000/classes/user', {
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
    const response = await fetch('http://localhost:3000/classes/trainer', {
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
    const response = await fetch('http://localhost:3000/classes', {
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
    const response = await fetch('http://localhost:3000/classes/enroll', {
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
    const response = await fetch('http://localhost:3000/classes/unenroll', {
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
    const response = await fetch(`http://localhost:3000/classes/${classId}`, {
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

export { getAllClasses, getUserClasses, getTrainerClasses, enrollInClass, unenrollFromClass, createClass, deleteClass };