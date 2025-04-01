export const createUserTraining = async (trainingData) => {
  try {
    const response = await fetch('http://localhost:3000/training', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingData),
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating training plan:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};