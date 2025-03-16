import ActivityModel from "../models/UserActivity.js";
import actividadSchema from "../schemas/ActividadSchema.js";
import MESSAGES from "../messages/messages.js";

export default class ActivityController {
  constructor() {
    this.activityModel = ActivityModel;
  }

  createActivity = async (req, res) => {
    const result = actividadSchema.validateCreateActivity(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const activity = await this.activityModel.create({
        ...result.data,
        idUsuario: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: "Actividad registrada correctamente",
        activity
      });
    } catch (error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  getUserActivities = async (req, res) => {
    try {
      const activities = await this.activityModel.findAll({
        where: { idUsuario: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        activities
      });
    } catch (error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }
}