import { API_URL } from '../config/constants';

export const fetchAllGyms = async () => {
  try {
    const response = await fetch(`${API_URL}/gym`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched gyms:', data);
    return data.gyms;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
};

export const fetchGymById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/gym/${id}`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.gym;
  } catch (error) {
    console.error(`Error fetching gym with id ${id}:`, error);
    throw error;
  }
};

export const createGym = async (gymData) => {
  try {
    const response = await fetch(`${API_URL}/gym`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(gymData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.gym;
  } catch (error) {
    console.error('Error creating gym:', error);
    throw error;
  }
};

export const updateGym = async (id, gymData) => {
  try {
    const response = await fetch(`${API_URL}/gym/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(gymData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.gym;
  } catch (error) {
    console.error(`Error updating gym with id ${id}:`, error);
    throw error;
  }
};

export const deleteGym = async (id) => {
  try {
    const response = await fetch(`${API_URL}/gym/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting gym with id ${id}:`, error);
    throw error;
  }
};