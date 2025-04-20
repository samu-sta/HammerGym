import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import StripeService from '../services/StripeService.js';
import { Op } from 'sequelize';
import { addMonths } from 'date-fns';

const stripeService = new StripeService();

export const getUserContracts = async (req, res) => {
  const userId = req.account.id;
  const currentDate = new Date();

  try {
    const contract = await ContractModel.findOne({
      where: {
        userId,
        expirationDate: {
          [Op.gt]: currentDate // Only get non-expired contract
        }
      },
      include: [{
        model: MembershipModel,
        attributes: ['type'], // Exclude price
        as: 'membership'
      }],
      attributes: ['id', 'expirationDate', 'createdAt'], // Only include these fields
      order: [['createdAt', 'DESC']]
    });

    console.log(`Contract for user ${userId}:`, contract);

    if (!contract) {
      return res.json(null);
    }

    res.json(contract);
  } catch (error) {
    console.error(`Error retrieving contract for user ${userId}:`, error);
    res.status(500).json({
      message: 'Error retrieving user contract',
      error: error.message
    });
  }
};

// Función auxiliar para verificar si un usuario ya tiene un contrato activo
const userHasActiveContract = async (userId) => {
  const currentDate = new Date();

  const activeContracts = await ContractModel.findOne({
    where: {
      userId,
      expirationDate: {
        [Op.gt]: currentDate // Fecha de expiración mayor que la fecha actual = contrato activo
      }
    }
  });

  return activeContracts !== null;
};

export const createCheckoutSession = async (req, res) => {
  const { membershipId } = req.body;
  const userId = req.account.id; // Get userId from authenticated account

  try {
    if (!membershipId) {
      return res.status(400).json({
        message: 'Se requiere membershipId para crear una sesión de checkout',
        success: false
      });
    }

    // Verificar si el usuario ya tiene un contrato activo
    const hasActiveContract = await userHasActiveContract(userId);
    if (hasActiveContract) {
      return res.status(400).json({
        message: 'Ya tienes un contrato activo. No puedes adquirir otra membresía hasta que expire tu contrato actual.',
        success: false
      });
    }

    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({
        message: 'Membership not found',
        success: false
      });
    }

    const amount = Math.round(membership.price * 100);

    const sessionResult = await stripeService.createCheckoutSession(
      amount,
      'usd',
      membership.type,
      membershipId,
      userId
    );

    if (!sessionResult.success) {
      return res.status(400).json({
        message: 'Failed to create checkout session',
        error: sessionResult.error,
        success: false
      });
    }

    res.json({
      message: 'Checkout session created successfully',
      sessionId: sessionResult.session.id,
      success: true,
      url: sessionResult.session.url
    });

  }
  catch (error) {
    res.status(500).json({
      message: 'Error creating checkout session',
      error: error.message,
      success: false
    });
  }
};

// Crear una sesión de checkout para renovar un contrato existente
export const createRenewalCheckoutSession = async (req, res) => {
  const { contractId } = req.params;
  const userId = req.account.id;

  try {
    // Verificar que el contrato existe y pertenece al usuario
    const contract = await ContractModel.findOne({
      where: {
        id: contractId,
        userId
      },
      include: [{
        model: MembershipModel,
        as: 'membership'
      }]
    });

    if (!contract) {
      return res.status(404).json({
        message: 'Contrato no encontrado o no tienes permiso para renovarlo',
        success: false
      });
    }

    // Obtener la información de la membresía asociada al contrato
    const membership = contract.membership;
    if (!membership) {
      return res.status(404).json({
        message: 'Información de membresía no disponible',
        success: false
      });
    }

    // El precio es para 1 mes (renovación)
    const amount = Math.round(membership.price * 100);

    // Crear sesión de Stripe para el pago de renovación
    const sessionResult = await stripeService.createRenewalCheckoutSession(
      amount,
      'usd',
      `Renovación de ${membership.type} - 1 mes`,
      contract.id,
      userId
    );

    if (!sessionResult.success) {
      return res.status(400).json({
        message: 'Error al crear la sesión de pago para renovación',
        error: sessionResult.error,
        success: false
      });
    }

    res.json({
      message: 'Sesión de pago para renovación creada',
      sessionId: sessionResult.session.id,
      success: true,
      url: sessionResult.session.url
    });
  } catch (error) {
    console.error('Error al crear la sesión de pago para renovación:', error);
    res.status(500).json({
      message: 'Error al crear la sesión de pago para renovación',
      error: error.message,
      success: false
    });
  }
};

// Procesar la renovación de un contrato después del pago
export const renewContract = async (req, res) => {
  const { contractId } = req.params;
  const userId = req.account.id;

  try {
    // Verificar que el contrato existe y pertenece al usuario
    const contract = await ContractModel.findOne({
      where: {
        id: contractId,
        userId
      },
      include: [{
        model: MembershipModel,
        as: 'membership'
      }]
    });

    if (!contract) {
      return res.status(404).json({
        message: 'Contrato no encontrado o no tienes permiso para renovarlo',
        success: false
      });
    }

    // Calcular la nueva fecha de expiración (1 mes adicional)
    let newExpirationDate = new Date(contract.expirationDate);

    // Si la fecha de expiración ya pasó, comenzar a contar desde hoy
    const currentDate = new Date();
    if (newExpirationDate < currentDate) {
      newExpirationDate = currentDate;
    }

    // Añadir 1 mes a la fecha actual de expiración
    newExpirationDate = addMonths(newExpirationDate, 1);

    // Actualizar la fecha de expiración del contrato
    await contract.update({
      expirationDate: newExpirationDate
    });

    res.json({
      message: 'Contrato renovado exitosamente',
      contract: {
        id: contract.id,
        expirationDate: newExpirationDate,
        membershipType: contract.membership?.type
      },
      success: true
    });
  } catch (error) {
    console.error('Error al renovar contrato:', error);
    res.status(500).json({
      message: 'Error al renovar contrato',
      error: error.message,
      success: false
    });
  }
};