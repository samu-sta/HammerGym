import ContractModel from '../models/Contract.js';
import { addMonths } from 'date-fns';

/**
 * Renueva un contrato existente
 * @param {number} contractId - ID del contrato a renovar
 * @param {number} userId - ID del usuario asociado al contrato
 * @param {string} paymentReference - Referencia de pago
 * @returns {Promise<Object>} - Objeto de respuesta con éxito o error
 */
export const renewContract = async (contractId, userId, paymentReference) => {
  try {
    // Buscar el contrato existente
    const contract = await ContractModel.findOne({
      where: {
        id: parseInt(contractId),
        userId: parseInt(userId)
      }
    });

    if (!contract) {
      return {
        success: false,
        status: 404,
        error: 'Contrato no encontrado para renovación'
      };
    }

    // Calcular la nueva fecha de expiración
    let newExpirationDate = calculateNewExpirationDate(contract.expirationDate);

    // Actualizar la fecha de expiración del contrato
    await contract.update({
      expirationDate: newExpirationDate,
      paymentReference // Actualizar referencia de pago
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: `Error renovando contrato: ${error.message}`
    };
  }
};

/**
 * Calcula la nueva fecha de expiración para un contrato
 * @param {Date} currentExpirationDate - Fecha de expiración actual
 * @returns {Date} - Nueva fecha de expiración
 */
export const calculateNewExpirationDate = (currentExpirationDate) => {
  let newExpirationDate = new Date(currentExpirationDate);

  // Si la fecha de expiración ya pasó, comenzar a contar desde hoy
  const currentDate = new Date();
  if (newExpirationDate < currentDate) {
    newExpirationDate = currentDate;
  }

  // Añadir 1 mes a la fecha actual de expiración
  return addMonths(newExpirationDate, 1);
};

/**
 * Crea un nuevo contrato
 * @param {Object} contractData - Datos del contrato a crear
 * @returns {Promise<Object>} - Objeto de respuesta con éxito o error
 */
export const createContract = async (contractData) => {
  const { userId, membershipId, paymentReference } = contractData;

  try {
    if (!userId || !membershipId) {
      return {
        success: false,
        status: 400,
        error: 'Datos incompletos para crear contrato'
      };
    }

    const expirationDate = addMonths(new Date(), 1);

    await ContractModel.create({
      userId: parseInt(userId),
      membershipId: parseInt(membershipId),
      expirationDate,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentReference
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: `Error creando contrato: ${error.message}`
    };
  }
};