import MembershipFeatureModel from "../models/MembershipFeature.js";
import MembershipModel from "../models/Membership.js";

export const getMembershipFeatures = async (req, res) => {
  try {
    const membershipFeatures = await MembershipFeatureModel.findAll({
      include: [
        {
          model: MembershipModel,
          attributes: ['type', 'price'],
          as: 'membership'
        }
      ]
    });
    res.json({ membershipFeatures });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener características de membresías",
      error: error.message
    });
  }
};

export const getMembershipFeatureById = async (req, res) => {
  const { id } = req.params;

  try {
    const membershipFeature = await MembershipFeatureModel.findByPk(id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['type', 'price'],
          as: 'membership'
        }
      ]
    });

    if (!membershipFeature) {
      return res.status(404).json({
        message: "Característica de membresía no encontrada"
      });
    }

    res.json({ membershipFeature });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener la característica de membresía",
      error: error.message
    });
  }
};

export const createMembershipFeature = async (req, res) => {
  const { membershipId, description } = req.body;

  if (!membershipId || !description) {
    return res.status(400).json({
      message: "Se requiere membershipId y description"
    });
  }

  try {
    // Verificar que la membresía existe
    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({
        message: "La membresía especificada no existe"
      });
    }

    const newFeature = await MembershipFeatureModel.create({
      membershipId,
      description
    });

    const membershipFeature = await MembershipFeatureModel.findByPk(newFeature.id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['type', 'price'],
          as: 'membership'
        }
      ]
    });

    res.status(201).json({
      message: "Característica de membresía creada exitosamente",
      membershipFeature
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear la característica de membresía",
      error: error.message
    });
  }
};

export const updateMembershipFeature = async (req, res) => {
  const { id } = req.params;
  const { membershipId, description } = req.body;

  if (!membershipId || !description) {
    return res.status(400).json({
      message: "Se requiere membershipId y description"
    });
  }

  try {
    // Verificar que la característica existe
    const membershipFeature = await MembershipFeatureModel.findByPk(id);
    if (!membershipFeature) {
      return res.status(404).json({
        message: "Característica de membresía no encontrada"
      });
    }

    // Verificar que la membresía existe
    if (membershipId) {
      const membership = await MembershipModel.findByPk(membershipId);
      if (!membership) {
        return res.status(404).json({
          message: "La membresía especificada no existe"
        });
      }
    }

    await membershipFeature.update({
      membershipId,
      description
    });

    const updatedFeature = await MembershipFeatureModel.findByPk(id, {
      include: [
        {
          model: MembershipModel,
          attributes: ['type', 'price'],
          as: 'membership'
        }
      ]
    });

    res.json({
      message: "Característica de membresía actualizada exitosamente",
      membershipFeature: updatedFeature
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la característica de membresía",
      error: error.message
    });
  }
};

export const deleteMembershipFeature = async (req, res) => {
  const { id } = req.params;

  try {
    const membershipFeature = await MembershipFeatureModel.findByPk(id);

    if (!membershipFeature) {
      return res.status(404).json({
        message: "Característica de membresía no encontrada"
      });
    }

    await membershipFeature.destroy();

    res.json({
      message: "Característica de membresía eliminada exitosamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar la característica de membresía",
      error: error.message
    });
  }
};