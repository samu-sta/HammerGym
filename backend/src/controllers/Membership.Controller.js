import MembershipModel from '../models/Membership.js';

export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await MembershipModel.findAll();
    res.json({
      message: 'Memberships retrieved successfully',
      memberships
    });
  } catch (error) {
    console.error('Error retrieving memberships:', error);
    res.status(500).json({
      message: 'Error retrieving memberships',
      error: error.message
    });
  }
};

export const getMembershipById = async (req, res) => {
  const { id } = req.params;

  try {
    const membership = await MembershipModel.findByPk(id);

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({
      message: 'Membership retrieved successfully',
      membership
    });
  } catch (error) {
    console.error(`Error retrieving membership with id ${id}:`, error);
    res.status(500).json({
      message: 'Error retrieving membership',
      error: error.message
    });
  }
};

export const createMembership = async (req, res) => {
  const { price, type } = req.body;

  try {
    const newMembership = await MembershipModel.create({
      price,
      type
    });

    res.status(201).json({
      message: 'Membership created successfully',
      membership: newMembership
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({
      message: 'Error creating membership',
      error: error.message
    });
  }
};