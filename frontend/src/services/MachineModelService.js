import { API_URL } from '../config/constants';

export const fetchAllMachineModels = async () => {
  try {
    const response = await fetch(`${API_URL}/machine-model`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched machine models:', data);
    return data.machineModels;
  } catch (error) {
    console.error('Error fetching machine models:', error);
    throw error;
  }
};

export const fetchMachineModelById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/machine-model/${id}`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machineModel;
  } catch (error) {
    console.error(`Error fetching machine model with id ${id}:`, error);
    throw error;
  }
};

export const createMachineModel = async (machineModelData) => {
  try {
    const response = await fetch(`${API_URL}/machine-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(machineModelData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machineModel;
  } catch (error) {
    console.error('Error creating machine model:', error);
    throw error;
  }
};

export const updateMachineModel = async (id, machineModelData) => {
  try {
    const response = await fetch(`${API_URL}/machine-model/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(machineModelData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machineModel;
  } catch (error) {
    console.error(`Error updating machine model with id ${id}:`, error);
    throw error;
  }
};

export const deleteMachineModel = async (id) => {
  try {
    const response = await fetch(`${API_URL}/machine-model/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting machine model with id ${id}:`, error);
    throw error;
  }
};