import { API_URL } from '../config/constants';

export const fetchAllMemberships = async () => {
  try {
    const response = await fetch(`${API_URL}/memberships`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.memberships;
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
};

export const fetchMembershipById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/memberships/${id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.membership;
  } catch (error) {
    console.error(`Error fetching membership with id ${id}:`, error);
    throw error;
  }
};

export const getUserContracts = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/contracts/user/${userId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.contracts;
  } catch (error) {
    console.error(`Error fetching contracts for user ${userId}:`, error);
    throw error;
  }
};

export const createContract = async (contractData) => {
  try {
    const response = await fetch(`${API_URL}/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.contract;
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};