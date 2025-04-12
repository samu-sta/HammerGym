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

const enrollInClass = async (classId) => {
  try {
    const response = await fetch('http://localhost:3000/classes/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ classId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enrolling in class:', error);
    return { success: false, message: 'Error al inscribirse en la clase' };
  }
};

const unenrollFromClass = async (classId) => {
  try {
    const response = await fetch('http://localhost:3000/classes/unenroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ classId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error unenrolling from class:', error);
    return { success: false, message: 'Error al cancelar la inscripción' };
  }
};

export { getAllClasses, getUserClasses, enrollInClass, unenrollFromClass };