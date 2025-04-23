import { API_URL } from '../config/constants';

export const createProgressUser = async (progress) => {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión con el servidor'
    };
  }
}