import UserProgressModel from "../models/UserProgress.js";
import { validateCreateProgressUser } from "../schemas/ProgressUserSchema.js";
import { Op } from "sequelize";
import MESSAGES from "../messages/messages.js";
import AccountModel from "../models/Account.js";
import UserModel from "../models/User.js";
export default class UserProgressController {


  createProgress = async (req, res) => {
    req.body.date = new Date(req.body.date);
    const result = validateCreateProgressUser(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({ success: false, message: result.error });
    }

    try {
      const userId = req.account.id;

      await UserProgressModel.upsert({
        userId: userId,
        date: result.data.date,
        howWasIt: result.data.howWasIt,
        observations: result.data.observations
      });

      const wasUpdate = await UserProgressModel.findOne({
        where: {
          userId,
          date: result.data.date
        }
      });

      const message = wasUpdate ? MESSAGES.PROGRESS_UPDATED : MESSAGES.PROGRESS_CREATED;

      return res.status(200).json({
        success: true,
        message
      });
    }
    catch (error) {
      console.error('Error managing progress:', error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error"
      });
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

  getProgressByUserId = async (req, res) => {
    try {
      const { userEmail } = req.params;

      const progress = await UserProgressModel.findAll({
        attributes: ['date', 'howWasIt', 'observations'],
        include: [{
          model: UserModel,
          as: 'user',
          attributes: [],
          include: [{
            model: AccountModel,
            as: 'account',
            attributes: ['username'],
            where: {
              email: userEmail
            }
          }]
        }]
      });

      if (!progress || progress.length === 0) {
        return res.status(404).json({ success: false, message: MESSAGES.USER_NOT_FOUND });
      }

      return res.status(200).json({ success: true, data: progress });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

