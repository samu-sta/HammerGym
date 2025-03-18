import UserActivityModel from "../models/UserActivity.js";
import actividadSchema from "../schemas/ActivitiesSchema.js";
import MESSAGES from "../messages/messages.js";
import GymModel from "../models/Gym.js";
import sequelize from "../database/database.js";

export default class UserActivityController {
  constructor() {
    this.userActivityModel = UserActivityModel;
  }

  createActivity = async (req, res) => {
    const result = actividadSchema.validateCreateActivity(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const activity = await this.userActivityModel.create({
        type: result.data.type,
        gymId: result.data.gymId,
        userId: req.account.id,
        dateTime: new Date()
      });

      return res.status(201).json({
        success: true,
        message: "Actividad registrada correctamente"
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  getUserActivities = async (req, res) => {
    try {

      const activities = await this.userActivityModel.findAll({
        attributes: ['id', 'type', 'dateTime'],
        where: { userId: req.account.id },
        order: [['dateTime', 'DESC']],
        include: [{
          model: GymModel,
          attributes: ['location'],
          as: 'gym'
        }]
      });

      if (activities.length === 0) {
        console.log(MESSAGES.NO_ACTIVITIES);
        return res.status(404).json({ error: MESSAGES.NO_ACTIVITIES });
      }

      return res.status(200).json({
        success: true,
        activities
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }
}