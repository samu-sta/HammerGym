import GymModel from "../models/Gym.js";
import gymSchema from "../schemas/GymSchema.js";
import MESSAGES from "../messages/messages.js";

export default class GymController {
  getAllGyms = async (_req, res) => {
    try {
      const gyms = await GymModel.findAll();
      return res.status(200).json({ success: true, gyms });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getGymById = async (req, res) => {
    const { id } = req.params;
    try {
      const gym = await GymModel.findByPk(id);
      if (!gym) {
        return res.status(404).json({ success: false, message: "Gimnasio no encontrado" });
      }
      return res.status(200).json({ success: true, gym });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  createGym = async (req, res) => {
    const result = gymSchema.validateCreateGym(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.errors
      });
    }

    try {
      const newGym = await GymModel.create(result.data);
      return res.status(201).json({ success: true, gym: newGym });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  updateGym = async (req, res) => {
    const { id } = req.params;
    const result = gymSchema.validateUpdateGym(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: result.error.errors
      });
    }

    try {
      const gym = await GymModel.findByPk(id);
      if (!gym) {
        return res.status(404).json({ success: false, message: "Gimnasio no encontrado" });
      }

      await gym.update(result.data);
      return res.status(200).json({ success: true, gym });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteGym = async (req, res) => {
    const { id } = req.params;
    try {
      const gym = await GymModel.findByPk(id);
      if (!gym) {
        return res.status(404).json({ success: false, message: "Gimnasio no encontrado" });
      }

      await gym.destroy();
      return res.status(200).json({ success: true, message: "Gimnasio eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
}