import { API_URL } from '../config/constants';

export const fetchAllMembershipFeatures = async () => {
  try {
    const response = await fetch(`${API_URL}/membership-features`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.membershipFeatures;
  } catch (error) {
    console.error('Error fetching membership features:', error);
    throw error;
  }
};

export const fetchMembershipFeatureById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/membership-features/${id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.membershipFeature;
  } catch (error) {
    console.error(`Error fetching membership feature with id ${id}:`, error);
    throw error;
  }
};

export const createMembershipFeature = async (membershipFeatureData) => {
  try {
    const response = await fetch(`${API_URL}/membership-features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(membershipFeatureData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.membershipFeature;
  } catch (error) {
    console.error('Error creating membership feature:', error);
    throw error;
  }
};

export const updateMembershipFeature = async (id, membershipFeatureData) => {
  try {
    const response = await fetch(`${API_URL}/membership-features/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(membershipFeatureData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.membershipFeature;
  } catch (error) {
    console.error(`Error updating membership feature with id ${id}:`, error);
    throw error;
  }
};

export const deleteMembershipFeature = async (id) => {
  try {
    const response = await fetch(`${API_URL}/membership-features/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting membership feature with id ${id}:`, error);
    throw error;
  }
};