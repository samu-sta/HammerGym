import UserProgressModel from "../models/UserProgress.js";
import { validateCreateProgressUser } from "../schemas/ProgressUserSchema.js";
import { Op } from "sequelize";
import MESSAGES from "../messages/messages.js";
export default class UserProgressController {


  createProgress = async (req, res) => {
    req.body.date = new Date(req.body.date);
    const result = validateCreateProgressUser(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({ success: false, message: result.error });
    }
    try {

      const progress = await UserProgressModel.findOne({
        where: {
          userId: req.account.id,
          date: result.data.date
        }
      });
      if (progress) {
        return res.status(400).json({ success: false, message: MESSAGES.PROGRESS_ALREADY_EXISTS });
      }

      await UserProgressModel.create({
        userId: req.account.id,
        trainingId: result.data.trainingId,
        date: result.data.date,
        howWasIt: result.data.howWasIt,
        observations: result.data.observations
      });

      return res.status(201).json({ success: true });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }

  getProgress = async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const progress = await UserProgressModel.findAll({
        where: {
          userId: req.account.id,
          date: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      });

      return res.status(200).json({ success: true, data: progress });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

