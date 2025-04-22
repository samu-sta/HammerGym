import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
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

// ======= ADMIN CRUD FUNCTIONS =======

// Get all contracts with user information (for admin)
export const getAllContracts = async (req, res) => {
  try {
    const contracts = await ContractModel.findAll({
      include: [
        {
          model: MembershipModel,
          attributes: ['id', 'type', 'price'],
          as: 'membership'
        },
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: AccountModel,
              as: 'account',
              attributes: ['username', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(contracts);
  } catch (error) {
    console.error('Error retrieving contracts:', error);
    res.status(500).json({
      message: 'Error retrieving contracts',
      error: error.message
    });
  }
};

// Get contract by ID (for admin)
export const getContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await ContractModel.findByPk(id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['id', 'type', 'price'],
          as: 'membership'
        },
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: AccountModel,
              as: 'account',
              attributes: ['username', 'email']
            }
          ]
        }
      ]
    });

    if (!contract) {
      return res.status(404).json({
        message: 'Contract not found',
        success: false
      });
    }

    res.json(contract);
  } catch (error) {
    console.error(`Error retrieving contract with ID ${id}:`, error);
    res.status(500).json({
      message: 'Error retrieving contract',
      error: error.message
    });
  }
};

// Create a new contract (for admin)
export const createContract = async (req, res) => {
  const { username, membershipId, expirationDate, paymentStatus, paymentMethod, paymentReference } = req.body;

  try {
    // Find user by username instead of ID
    const account = await AccountModel.findOne({
      where: { username },
      include: [{ model: UserModel, as: 'user' }]
    });

    if (!account || !account.user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    // Verify the membership exists
    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({
        message: 'Membership not found',
        success: false
      });
    }

    const userId = account.user.accountId;

    // Check if user already has an active contract
    const hasActiveContract = await userHasActiveContract(userId);
    if (hasActiveContract) {
      return res.status(400).json({
        message: 'User already has an active contract',
        success: false
      });
    }

    // Create the new contract
    const newContract = await ContractModel.create({
      userId,
      membershipId,
      expirationDate,
      paymentStatus: paymentStatus || 'paid',
      paymentMethod,
      paymentReference
    });

    // Fetch the created contract with all related information
    const contractWithInfo = await ContractModel.findByPk(newContract.id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['id', 'type', 'price'],
          as: 'membership'
        },
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: AccountModel,
              as: 'account',
              attributes: ['username', 'email']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Contract created successfully',
      contract: contractWithInfo,
      success: true
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      message: 'Error creating contract',
      error: error.message,
      success: false
    });
  }
};

// Update a contract (for admin)
export const updateContract = async (req, res) => {
  const { id } = req.params;
  const { username, membershipId, expirationDate, paymentStatus, paymentMethod, paymentReference } = req.body;

  try {
    // Find the contract
    const contract = await ContractModel.findByPk(id);
    if (!contract) {
      return res.status(404).json({
        message: 'Contract not found',
        success: false
      });
    }

    let userId = contract.userId;

    // If username is provided, find the corresponding user
    if (username) {
      const account = await AccountModel.findOne({
        where: { username },
        include: [{ model: UserModel, as: 'user' }]
      });

      if (!account || !account.user) {
        return res.status(404).json({
          message: 'User not found',
          success: false
        });
      }
      userId = account.user.accountId;
    }

    // If membershipId is provided, verify it exists
    if (membershipId) {
      const membership = await MembershipModel.findByPk(membershipId);
      if (!membership) {
        return res.status(404).json({
          message: 'Membership not found',
          success: false
        });
      }
    }

    // Update the contract
    await contract.update({
      userId,
      membershipId: membershipId || contract.membershipId,
      expirationDate: expirationDate || contract.expirationDate,
      paymentStatus: paymentStatus || contract.paymentStatus,
      paymentMethod: paymentMethod || contract.paymentMethod,
      paymentReference: paymentReference || contract.paymentReference
    });

    // Get the updated contract with all related information
    const updatedContract = await ContractModel.findByPk(id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['id', 'type', 'price'],
          as: 'membership'
        },
        {
          model: UserModel,
          as: 'user',
          include: [
            {
              model: AccountModel,
              as: 'account',
              attributes: ['username', 'email']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Contract updated successfully',
      contract: updatedContract,
      success: true
    });
  } catch (error) {
    console.error(`Error updating contract with ID ${id}:`, error);
    res.status(500).json({
      message: 'Error updating contract',
      error: error.message,
      success: false
    });
  }
};

// Delete a contract (for admin)
export const deleteContract = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await ContractModel.findByPk(id);
    if (!contract) {
      return res.status(404).json({
        message: 'Contract not found',
        success: false
      });
    }

    await contract.destroy();

    res.json({
      message: 'Contract deleted successfully',
      success: true
    });
  } catch (error) {
    console.error(`Error deleting contract with ID ${id}:`, error);
    res.status(500).json({
      message: 'Error deleting contract',
      error: error.message,
      success: false
    });
  }
};