import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import StripeService from '../services/StripeService.js';

const stripeService = new StripeService();

export const getUserContracts = async (req, res) => {
  const userId = req.account.id;

  try {
    const contracts = await ContractModel.findAll({
      where: { userId },
      include: [{
        model: MembershipModel,
        attributes: ['type', 'price'],
        as: 'membership'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'User contracts retrieved successfully',
      contracts
    });
  } catch (error) {
    console.error(`Error retrieving contracts for user ${userId}:`, error);
    res.status(500).json({
      message: 'Error retrieving user contracts',
      error: error.message
    });
  }
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