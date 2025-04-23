import { API_URL } from '../config/constants';

export const getAllExercises = async () => {
  try {
    const response = await fetch(`${API_URL}/api/exercises`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.exercises;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};

export const createExercise = async (exerciseData) => {
  try {
    const response = await fetch(`${API_URL}/api/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(exerciseData),
    });
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await fetch(`${API_URL}/api/exercises/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(exerciseData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating exercise with id ${id}:`, error);
    throw error;
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/exercises/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting exercise with id ${id}:`, error);
    throw error;
  }
};