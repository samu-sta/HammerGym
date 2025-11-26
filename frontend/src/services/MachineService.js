import { API_URL } from '../config/constants';

export const fetchAllMachines = async () => {
  try {
    const response = await fetch(`${API_URL}/machines`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('Fetched machines:', data);
    return data.machines;
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

export const fetchMachineById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/machines/${id}`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machine;
  } catch (error) {
    console.error(`Error fetching machine with id ${id}:`, error);
    throw error;
  }
};

export const createMachine = async (machineData) => {
  try {
    const response = await fetch(`${API_URL}/machines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(machineData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machine;
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error;
  }
};

export const updateMachine = async (id, machineData) => {
  try {
    const response = await fetch(`${API_URL}/machines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(machineData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.machine;
  } catch (error) {
    console.error(`Error updating machine with id ${id}:`, error);
    throw error;
  }
};

export const deleteMachine = async (id) => {
  try {
    const response = await fetch(`${API_URL}/machines/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting machine with id ${id}:`, error);
    throw error;
  }
};

export const fetchGymLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/gym/locations`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gym locations:', error);
    throw error;
  }
};

export const fetchMachineModels = async () => {
  try {
    const response = await fetch(`${API_URL}/machine-model`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching machine models:', error);
    throw error;
  }
};

/**
 * Obtiene todos los datos de equipamiento con KPIs (solo admin)
 * Incluye máquinas con KPIs, historial de mantenimiento, métricas y piezas
 */
export const fetchEquipmentDatasets = async () => {
  try {
    const response = await fetch(`${API_URL}/machines/admin/datasets`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment datasets:', error);
    throw error;
  }
};