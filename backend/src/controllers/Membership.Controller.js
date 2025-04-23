import MembershipModel from '../models/Membership.js';
import MembershipFeatureModel from '../models/MembershipFeature.js';

export default class MembershipController {
  getAllMemberships = async (req, res) => {
    try {
      const memberships = await MembershipModel.findAll({
        include: [
          {
            model: MembershipFeatureModel,
            as: 'features',
            attributes: ['id', 'description']
          }
        ]
      });
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

  getMembershipById = async (req, res) => {
    const { id } = req.params;

    try {
      const membership = await MembershipModel.findByPk(id, {
        include: [
          {
            model: MembershipFeatureModel,
            as: 'features',
            attributes: ['id', 'description']
          }
        ]
      });

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

  createMembership = async (req, res) => {
    const { price, type, features } = req.body;

    try {
      const newMembership = await MembershipModel.create({
        price,
        type
        // description field removed
      });

      // Si hay features, las creamos
      if (features && Array.isArray(features)) {
        await Promise.all(
          features.map(featureDescription =>
            MembershipFeatureModel.create({
              membershipId: newMembership.id,
              description: featureDescription
            })
          )
        );
      }

      // Obtenemos la membresía con las features
      const membershipWithFeatures = await MembershipModel.findByPk(newMembership.id, {
        include: [
          {
            model: MembershipFeatureModel,
            as: 'features',
            attributes: ['id', 'description']
          }
        ]
      });

      res.status(201).json({
        message: 'Membership created successfully',
        membership: membershipWithFeatures
      });
    } catch (error) {
      console.error('Error creating membership:', error);
      res.status(500).json({
        message: 'Error creating membership',
        error: error.message
      });
    }
  };

  updateMembership = async (req, res) => {
    const { id } = req.params;
    const { price, type } = req.body;

    try {
      const membership = await MembershipModel.findByPk(id);

      if (!membership) {
        return res.status(404).json({ message: 'Membership not found' });
      }

      membership.price = price;
      membership.type = type;

      await membership.save();

      res.json({
        message: 'Membership updated successfully',
        membership
      });
    }
    catch (error) {
      res.status(500).json({
        message: 'Error updating membership',
        error: error.message
      });
    }
  };

  deleteMembership = async (req, res) => {
    const { id } = req.params;

    try {
      const membership = await MembershipModel.findByPk(id);

      if (!membership) {
        return res.status(404).json({ message: 'Membership not found' });
      }

      await membership.destroy();

      res.json({
        message: 'Membership deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting membership:', error);
      res.status(500).json({
        message: 'Error deleting membership',
        error: error.message
      });
    }
  };
}