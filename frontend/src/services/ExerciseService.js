export const getAllExercises = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/exercises', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};