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

export { getAllClasses, getUserClasses };