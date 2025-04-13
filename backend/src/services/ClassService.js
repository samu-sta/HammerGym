import ClassModel from "../models/Class.js";
import UserModel from "../models/User.js";
import TrainerModel from "../models/Trainer.js";
import ScheduleModel from "../models/Schedule.js";
import ScheduleDayModel from "../models/ScheduleDay.js";
import AccountModel from "../models/Account.js";
import MESSAGES from "../messages/messages.js";
import sequelize from "../database/database.js";

export default class ClassService {
  getAllClasses = async () => {
    const classesData = await ClassModel.findAll({
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

    return this.refactorClasses(classesData);
  };

  enrollUserInClass = async (classId, userId) => {
    const classInstance = await ClassModel.findByPk(classId);

    if (!classInstance) {
      throw new Error({ messages: MESSAGES.CLASS_NOT_FOUND, status: 404 });
    }

    if (classInstance.currentCapacity >= classInstance.maxCapacity) {
      throw new Error({ messages: MESSAGES.CLASS_FULL, status: 400 });
    }

    const user = await UserModel.findOne({ where: { accountId: userId } });
    const isRegistered = await user.getRegisteredClasses({ where: { id: classId } });

    if (isRegistered.length > 0) {
      throw new Error({ messages: MESSAGES.ALREADY_ENROLLED, status: 400 });
    }

    await user.addRegisteredClass(classInstance);
    await user.save();

    classInstance.currentCapacity += 1;
    await classInstance.save();

    return true;
  };

  unenrollUserFromClass = async (classId, userId) => {
    const classInstance = await ClassModel.findByPk(classId);

    if (!classInstance) {
      throw new Error({ messages: MESSAGES.CLASS_NOT_FOUND, status: 404 });
    }

    const user = await UserModel.findOne({ where: { accountId: userId } });
    const isRegistered = await user.getRegisteredClasses({ where: { id: classId } });

    if (isRegistered.length === 0) {
      throw new Error({ messages: MESSAGES.NOT_ENROLLED, status: 400 });
    }

    await user.removeRegisteredClass(classInstance);
    classInstance.currentCapacity -= 1;
    await classInstance.save();

    return true;
  };

  createClass = async (classData, trainerId) => {
    const { name, description, maxCapacity, schedule, difficulty } = classData;
    const t = await sequelize.transaction();

    try {
      const trainer = await TrainerModel.findOne({
        where: { accountId: trainerId },
        transaction: t
      });

      if (!trainer) {
        throw new Error({ messages: MESSAGES.NO_PERMISSION_CREATE_CLASS, status: 403 });
      }

      const newClass = await ClassModel.create({
        name,
        description,
        maxCapacity,
        difficulty,
        trainerId: trainer.id,
        currentCapacity: 0
      }, { transaction: t });

      const newSchedule = await ScheduleModel.create({
        classId: newClass.id,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate)
      }, { transaction: t });

      const scheduleDays = schedule.scheduleDays.map(day => ({
        scheduleId: newClass.id,
        day: day.day,
        startHour: day.startHour,
        endHour: day.endHour
      }));

      await ScheduleDayModel.bulkCreate(scheduleDays, { transaction: t });

      await t.commit();
    }
    catch (error) {
      await t.rollback();
      throw error;
    }
  };

  getUserClasses = async (userId) => {
    const user = await UserModel.findOne({
      where: { accountId: userId }
    });

    const classesData = await user.getRegisteredClasses({
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
      ]
    });

    return this.refactorClasses(classesData);
  };

  refactorClasses = (classesData, includeTrainer = true) => {
    return classesData.map(classItem => {
      const classObj = {
        id: classItem.id,
        name: classItem.name,
        description: classItem.description,
        maxCapacity: classItem.maxCapacity,
        currentCapacity: classItem.currentCapacity,
        difficulty: classItem.difficulty,
        schedule: classItem.schedule ? {
          startDate: classItem.schedule.startDate,
          endDate: classItem.schedule.endDate,
          scheduleDays: classItem.schedule.scheduleDays ?
            classItem.schedule.scheduleDays.map(day => ({
              day: day.day,
              startHour: day.startHour,
              endHour: day.endHour
            })) : []
        } : null
      };

      if (includeTrainer && classItem.trainer && classItem.trainer.account) {
        classObj.trainer = {
          account: {
            username: classItem.trainer.account.username,
            email: classItem.trainer.account.email
          }
        };
      }

      if (classItem.SignedUpIn) {
        classObj.SignedUpIn = classItem.SignedUpIn.createdAt;
      }

      return classObj;
    });
  }

  getTrainerClasses = async (trainerId) => {
    const trainer = await TrainerModel.findOne({ where: { accountId: trainerId } });

    if (!trainer) {
      throw new Error({ messages: MESSAGES.NO_PERMISSION_CREATE_CLASS, status: 403 });
    }

    const classesData = await ClassModel.findAll({
      where: { trainerId: trainer.id },
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
        }
      ]
    });

    return this.refactorClasses(classesData, false);
  }

  deleteClass = async (classId) => {
    const classInstance = await ClassModel.findByPk(classId);

    if (!classInstance) {
      throw new Error({ messages: MESSAGES.CLASS_NOT_FOUND, status: 404 });
    }

    await classInstance.destroy();
  }
}