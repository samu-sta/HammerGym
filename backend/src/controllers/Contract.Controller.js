import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';

export const getUserContracts = async (req, res) => {
  const { userId } = req.params;

  try {
    const contracts = await ContractModel.findAll({
      where: { userId },
      include: [{
        model: MembershipModel,
        attributes: ['type', 'price']
      }]
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

export const createContract = async (req, res) => {
  const { userId, membershipId, expirationDate } = req.body;

  try {
    // Check if membership exists
    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    const newContract = await ContractModel.create({
      userId,
      membershipId,
      expirationDate
    });

    res.status(201).json({
      message: 'Contract created successfully',
      contract: newContract
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      message: 'Error creating contract',
      error: error.message
    });
  }
};

export const getContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await ContractModel.findByPk(id, {
      include: [{
        model: MembershipModel,
        attributes: ['type', 'price']
      }]
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json({
      message: 'Contract retrieved successfully',
      contract
    });
  } catch (error) {
    console.error(`Error retrieving contract with id ${id}:`, error);
    res.status(500).json({
      message: 'Error retrieving contract',
      error: error.message
    });
  }
};