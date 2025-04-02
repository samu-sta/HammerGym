

export const getTrainerAssignedUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/trainer/assigned-users`, {
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