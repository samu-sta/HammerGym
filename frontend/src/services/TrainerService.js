import { API_URL } from '../config/constants';

export const getTrainerAssignedUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/trainer/assigned-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    return {
      success: false,
      message: 'Error connecting to server'
    };
  }
};


export const getUserProgressByEmail = async (userEmail) => {
  try {

    const response = await fetch(`${API_URL}/progress/${userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return await response.json();

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
};

export const fetchAllTrainers = async () => {
  try {
    const response = await fetch(`${API_URL}/trainer`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }


    const data = await response.json();
    return data.trainers;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

export const updateTrainer = async (id, trainerData) => {
  try {
    const response = await fetch(`${API_URL}/trainer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(trainerData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.trainer;
  } catch (error) {
    console.error(`Error updating trainer with id ${id}:`, error);
    throw error;
  }
};

export const deleteTrainer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/trainer/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting trainer with id ${id}:`, error);
    throw error;
  }
};