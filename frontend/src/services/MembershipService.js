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

export const getUserContracts = async () => {
  try {
    const response = await fetch(`${API_URL}/contracts/my-contracts`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // The API now returns a single contract object directly, not wrapped in a 'contracts' property
    const contract = await response.json();
    return contract;
  } catch (error) {
    console.error('Error fetching user contract:', error);
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
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

export const createStripeCheckoutSession = async (membershipId) => {
  try {
    const response = await fetch(`${API_URL}/contracts/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ membershipId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
};

export const processStripeRedirect = async (query) => {
  try {
    // Si hay un éxito con session_id y membership_id, crear el contrato
    if (query.success && query.session_id && query.membership_id) {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 3); // 3 meses desde ahora

      // Comprobar si el contrato ya fue creado por el webhook
      try {
        // Obtener el contrato del usuario autenticado
        const contract = await getUserContracts();

        if (contract && contract.paymentReference === query.session_id) {
          return {
            success: true,
            message: 'Tu pago ha sido procesado correctamente y tu membresía está activa.',
            contractId: contract.id
          };
        }
      } catch (e) {
        console.error('Error verificando contrato existente:', e);
      }

      // Si no existe, crear el contrato manualmente
      const contractData = {
        membershipId: query.membership_id,
        expirationDate: expirationDate.toISOString(),
        paymentMethod: 'stripe',
        paymentReference: query.session_id
      };

      const result = await createContract(contractData);
      return result;
    }

    // Si hubo cancelación
    if (query.canceled) {
      return {
        success: false,
        message: 'El pago fue cancelado.'
      };
    }

    return {
      success: false,
      message: 'No hay información de transacción.'
    };
  } catch (error) {
    console.error('Error processing Stripe redirect:', error);
    throw error;
  }
};

export const renewContract = async (contractId) => {
  try {
    const response = await fetch(`${API_URL}/contracts/${contractId}/renew`, {
      method: 'POST',
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
    console.error('Error renewing contract:', error);
    throw error;
  }
};

export const createRenewalStripeCheckoutSession = async (contractId) => {
  try {
    const response = await fetch(`${API_URL}/contracts/${contractId}/renewal-checkout-session`, {
      method: 'POST',
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
    console.error('Error creating Stripe renewal checkout session:', error);
    throw error;
  }
};