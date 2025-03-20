export const loginAccount = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
};

export const registerAccount = async (accountData) => {
  try {
    const response = await fetch('http://localhost:3000/account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
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
};

export const updateAccount = async (accountData) => {
  try {
    const response = await fetch('http://localhost:3000/account/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
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
};