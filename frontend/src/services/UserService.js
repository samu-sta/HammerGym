export const getUserActivities = async () => {
  try {
    const response = await fetch('http://localhost:3000/user-activity', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};

export const getUserTraining = async () => {
  try {
    const response = await fetch('http://localhost:3000/training', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user training:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
}