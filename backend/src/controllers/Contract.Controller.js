import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import StripeService from '../services/StripeService.js';
import { Op } from 'sequelize';

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