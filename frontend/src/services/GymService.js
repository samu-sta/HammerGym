import { API_URL } from '../config/constants';

export const fetchAllGyms = async () => {
  try {
    const response = await fetch(`${API_URL}/gym`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.gyms || [];
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
};

export const fetchMachinesByGymId = async (gymId) => {
  try {
    const response = await fetch(`${API_URL}/machines/gym/${gymId}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machines || [];
  } catch (error) {
    console.error(`Error fetching machines for gym ${gymId}:`, error);
    throw error;
  }
};

export const fetchAllGymsWithMachines = async () => {
  try {
    const gyms = await fetchAllGyms();

    const gymsWithMachines = await Promise.all(gyms.map(async (gym) => {
      const machines = await fetchMachinesByGymId(gym.id);
      return {
        ...gym,
        machines
      };
    }));

    return gymsWithMachines;
  } catch (error) {
    console.error('Error fetching gyms with machines:', error);
    throw error;
  }
};

// Rutas autenticadas para administradores
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