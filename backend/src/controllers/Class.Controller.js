import ClassModel from "../models/Class.js";
import MESSAGES from "../messages/messages.js";
import UserModel from "../models/User.js";
import TrainerModel from "../models/Trainer.js";
import ScheduleModel from "../models/Schedule.js";
import ScheduleDayModel from "../models/ScheduleDay.js";
import AccountModel from "../models/Account.js";

export default class ClassController {
  getAllClasses = async (_req, res) => {
    try {
      const classes = await ClassModel.findAll({
        include: [
          {
            model: ScheduleModel,
            as: 'schedule',
            attributes: ['classId', 'startDate', 'endDate'],
            include: [
              {
                model: ScheduleDayModel,
                as: 'scheduleDays',
                attributes: ['day', 'startHour', 'endHour']
              }
            ]
          },
          {
            model: TrainerModel,
            as: 'trainer',
            include: [
              {
                model: AccountModel,
                as: 'account',
                attributes: ['username', 'email']
              }
            ]
          }
        ],
        attributes: {
          exclude: ['trainerId']
        }
      });

      return res.status(200).json({ success: true, classes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  enrollInClass = async (req, res) => {
    const classId = req.body.classId;
    const userId = req.account.id;
    console.log(classId);

    try {
      const classInstance = await ClassModel.findByPk(classId);

      if (!classInstance) {
        return res.status(404).json({ success: false, message: MESSAGES.CLASS_NOT_FOUND });
      }

      if (classInstance.currentCapacity >= classInstance.maxCapacity) {
        return res.status(400).json({ success: false, message: MESSAGES.CLASS_FULL });
      }

      const user = await UserModel.findOne({ where: { accountId: userId } });

      const isRegistered = await user.getRegisteredClasses({ where: { id: classId } });

      console.log(isRegistered);
      if (isRegistered.length > 0) {
        return res.status(400).json({ success: false, message: MESSAGES.ALREADY_ENROLLED });
      }
      await user.addRegisteredClass(classInstance)
      await user.save();

      classInstance.currentCapacity += 1;
      await classInstance.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  unenrollFromClass = async (req, res) => {
    const classId = req.body.classId;
    const userId = req.account.id;

    try {
      const classInstance = await ClassModel.findByPk(classId);

      if (!classInstance) {
        return res.status(404).json({ success: false, message: MESSAGES.CLASS_NOT_FOUND });
      }

      const user = await UserModel.findOne({ where: { accountId: userId } });

      const isRegistered = await user.getRegisteredClasses({ where: { id: classId } });

      if (isRegistered.length === 0) {
        return res.status(400).json({ success: false, message: MESSAGES.NOT_ENROLLED });
      }

      await user.removeRegisteredClass(classInstance);
      classInstance.currentCapacity -= 1;
      await classInstance.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  }

  createClass = async (req, res) => {
    const { name, description, maxCapacity, schedule, difficulty } = req.body;
    const trainerId = req.account.id;

    try {
      const trainer = await TrainerModel.findOne({ where: { accountId: trainerId } });

      if (!trainer) {
        return res.status(403).json({ success: false, message: MESSAGES.NO_PERMISSION_CREATE_CLASS });
      }

      const newClass = await ClassModel.create({
        name,
        description,
        maxCapacity,
        schedule,
        difficulty,
        trainerId: trainer.id,
        currentCapacity: 0
      });

      return res.status(201).json({
        success: true,
        message: MESSAGES.CLASS_CREATED,
        class: newClass
      });
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };


}