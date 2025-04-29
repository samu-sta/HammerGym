import { API_URL } from "../config/constants";

export const createUserTraining = async (trainingData) => {
  try {
    const response = await fetch(`${API_URL}/training`, {
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

export const getTrainingByUserEmail = async (userEmail) => {
  try {
    const response = await fetch(`${API_URL}/training/${userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching training:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};