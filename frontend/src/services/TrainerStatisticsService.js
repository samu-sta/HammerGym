import { API_URL } from '../config/constants';

export const getTrainersStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/trainer/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trainers statistics:', error);
    return {
      success: false,
      message: 'Error connecting to server'
    };
  }
};
