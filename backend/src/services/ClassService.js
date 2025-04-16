import ClassModel from "../models/Class.js";
import UserModel from "../models/User.js";
import TrainerModel from "../models/Trainer.js";
import ScheduleModel from "../models/Schedule.js";
import ScheduleDayModel from "../models/ScheduleDay.js";
import AccountModel from "../models/Account.js";
import AttendanceModel from "../models/Attendance.js";
import MESSAGES from "../messages/messages.js";
import sequelize from "../database/database.js";

export default class ClassService {
  async getAllClasses() {
    const classes = await ClassModel.findAll({
      include: [
        {
          model: ScheduleModel,
          as: 'schedule',
          include: [{ model: ScheduleDayModel, as: 'scheduleDays' }]
        },
        {
          model: TrainerModel,
          as: 'trainer',
          include: [{ model: AccountModel, as: 'account' }]
        }
      ],
      attributes: { exclude: ['trainerId'] }
    });

    return this.formatClassData(classes);
  }

  async enrollUserInClass(classId, userId) {
    const t = await sequelize.transaction();

    try {
      const classInstance = await ClassModel.findByPk(classId, { transaction: t });
      if (!classInstance) throw { status: 404, messages: MESSAGES.CLASS_NOT_FOUND };

      if (classInstance.currentCapacity >= classInstance.maxCapacity)
        throw { status: 400, messages: MESSAGES.CLASS_FULL };

      const user = await UserModel.findOne({
        where: { accountId: userId },
        transaction: t
      });

      const isRegistered = await user.getRegisteredClasses({
        where: { id: classId },
        transaction: t
      });

      if (isRegistered.length > 0) throw { status: 400, messages: MESSAGES.ALREADY_ENROLLED };

      await user.addRegisteredClass(classInstance, { transaction: t });
      classInstance.currentCapacity += 1;
      await classInstance.save({ transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async unenrollUserFromClass(classId, userId) {
    const t = await sequelize.transaction();

    try {
      const classInstance = await ClassModel.findByPk(classId, { transaction: t });
      if (!classInstance) throw { status: 404, messages: MESSAGES.CLASS_NOT_FOUND };

      const user = await UserModel.findOne({
        where: { accountId: userId },
        transaction: t
      });

      const isRegistered = await user.getRegisteredClasses({
        where: { id: classId },
        transaction: t
      });

      if (isRegistered.length === 0) throw { status: 400, messages: MESSAGES.NOT_ENROLLED };

      await user.removeRegisteredClass(classInstance, { transaction: t });
      classInstance.currentCapacity -= 1;
      await classInstance.save({ transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async createClass(classData, trainerId) {
    const { name, description, maxCapacity, schedule, difficulty } = classData;
    const t = await sequelize.transaction();

    try {
      const trainer = await TrainerModel.findOne({
        where: { accountId: trainerId },
        transaction: t
      });

      if (!trainer) throw { status: 403, messages: MESSAGES.NO_PERMISSION_CREATE_CLASS };

      const newClass = await ClassModel.create({
        name,
        description,
        maxCapacity,
        difficulty,
        trainerId: trainer.id,
        currentCapacity: 0
      }, { transaction: t });

      await ScheduleModel.create({
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
      return true;
    }
    catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getUserClasses(userId) {
    const user = await UserModel.findOne({ where: { accountId: userId } });

    const classes = await user.getRegisteredClasses({
      include: [
        {
          model: ScheduleModel,
          as: 'schedule',
          include: [{ model: ScheduleDayModel, as: 'scheduleDays' }]
        },
        {
          model: TrainerModel,
          as: 'trainer',
          include: [{ model: AccountModel, as: 'account' }]
        }
      ]
    });

    return this.formatClassData(classes);
  }

  async getTrainerClasses(trainerId) {
    const trainer = await TrainerModel.findOne({ where: { accountId: trainerId } });
    if (!trainer) throw { status: 403, messages: MESSAGES.NO_PERMISSION_CREATE_CLASS };

    const classes = await ClassModel.findAll({
      where: { trainerId: trainer.id },
      include: [{
        model: ScheduleModel,
        as: 'schedule',
        include: [{ model: ScheduleDayModel, as: 'scheduleDays' }]
      }]
    });

    return this.formatClassData(classes, false);
  }

  async deleteClass(classId) {
    return await ClassModel.destroy({ where: { id: classId } });
  }

  async recordAttendance(classId, attendanceData) {
    const t = await sequelize.transaction();

    try {
      // Find the class and include its schedule information
      const classInstance = await ClassModel.findByPk(classId, {
        include: [{
          model: ScheduleModel,
          as: 'schedule',
          include: [{
            model: ScheduleDayModel,
            as: 'scheduleDays'
          }]
        }],
        transaction: t
      });

      if (!classInstance) throw { status: 404, messages: MESSAGES.CLASS_NOT_FOUND };

      // Use the provided date or default to current date
      const attendanceDate = attendanceData.date ? new Date(attendanceData.date) : new Date();
      const dayOfWeek = this.getDayOfWeek(attendanceDate);

      // Validate if the date is within schedule range and matches a scheduled day
      this.isDateWithinSchedule(classInstance, attendanceDate);

      // Check if the day is a scheduled day for this class
      await this.isClassScheduledForDay(classInstance, dayOfWeek);


      const userMap = await this.getUserMapForClass(classInstance);

      await this.clearPreviousAttendance(classId, attendanceDate, t);

      if (attendanceData.users.length === 0) {
        await t.commit();
        return true;
      }

      await this.createAttendanceRecords(classId, attendanceData.users, userMap, attendanceDate, t);

      await t.commit();
      return true;
    }
    catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Helper method to get the day of the week as a string
  getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  // Helper method to check if a class is scheduled for a given day
  isDateWithinSchedule(classInstance, date) {

    const scheduleStartDate = new Date(classInstance.schedule.startDate);
    const scheduleEndDate = new Date(classInstance.schedule.endDate);

    // Reset time part for date comparison
    const dateToCheck = new Date(date.setHours(0, 0, 0, 0));
    const startDate = new Date(scheduleStartDate.setHours(0, 0, 0, 0));
    const endDate = new Date(scheduleEndDate.setHours(23, 59, 59, 999));

    if (!(dateToCheck >= startDate && dateToCheck <= endDate)) {
      throw {
        status: 403,
        messages: `La fecha seleccionada está fuera del período programado para esta clase.`
      };
    }
  }

  // Refactored the isClassScheduledForDay method to focus only on checking days
  isClassScheduledForDay(classInstance, dayOfWeek) {
    // Check if the day of week matches any scheduled day
    if (!classInstance.schedule.scheduleDays.some(scheduledDay => scheduledDay.day === dayOfWeek)) {
      throw {
        status: 403,
        messages: `No se puede registrar asistencia para ${dayOfWeek}. Esta clase solo se imparte en los días programados en su horario.`
      };
    }
  }

  async validateClassExists(classId) {
    const classInstance = await ClassModel.findByPk(classId
      , {
        include: [{
          model: ScheduleModel,
          as: 'schedule',
          include: [{ model: ScheduleDayModel, as: 'scheduleDays' }]
        }]
      });
    if (!classInstance) throw { status: 404, messages: MESSAGES.CLASS_NOT_FOUND };
    return classInstance;
  }

  async getUserMapForClass(classInstance) {
    const usersInClass = await classInstance.getRegisteredUsers({
      include: [{ model: AccountModel, as: 'account' }]
    });

    return new Map(
      usersInClass.map(user => [user.account.username, user.accountId])
    );
  }

  async clearPreviousAttendance(classId, attendanceDate, transaction) {
    await AttendanceModel.destroy({
      where: {
        classId,
        attendanceDate: attendanceDate
      },
      transaction
    });
  }

  async createAttendanceRecords(classId, users, userMap, attendanceDate, transaction) {
    const attendanceRecords = [];

    for (const userData of users) {
      const userId = userMap.get(userData.username);
      if (!userId) {
        throw { status: 404, messages: `El usuario ${userData.username} no está inscrito en esta clase` };
      }

      attendanceRecords.push({
        classId,
        userId,
        attendanceDate
      });
    }

    if (attendanceRecords.length > 0) {
      await AttendanceModel.bulkCreate(attendanceRecords, { transaction });
    }
  }

  formatClassData(classes, includeTrainer = true) {
    return classes.map(cls => {
      const result = {
        id: cls.id,
        name: cls.name,
        description: cls.description,
        maxCapacity: cls.maxCapacity,
        currentCapacity: cls.currentCapacity,
        difficulty: cls.difficulty,
        schedule: cls.schedule ? {
          startDate: cls.schedule.startDate,
          endDate: cls.schedule.endDate,
          scheduleDays: cls.schedule.scheduleDays?.map(day => ({
            day: day.day,
            startHour: day.startHour,
            endHour: day.endHour
          })) || []
        } : null
      };

      if (includeTrainer && cls.trainer?.account) {
        result.trainer = {
          account: {
            username: cls.trainer.account.username,
            email: cls.trainer.account.email
          }
        };
      }

      if (cls.SignedUpIn) {
        result.SignedUpIn = cls.SignedUpIn.createdAt;
      }

      return result;
    });
  }

  async getClassAttendanceData(classId, date) {
    const classInstance = await this.validateClassExists(classId);

    const users = await classInstance.getRegisteredUsers({
      include: [{ model: AccountModel, as: 'account' }]
    });

    const attendanceRecords = await AttendanceModel.findAll({
      where: {
        classId: classId,
        attendanceDate: date
      }
    });

    const attendedUserIdsSet = new Set(attendanceRecords.map(record => record.userId));

    return users.map(user => ({
      username: user.account.username,
      email: user.account.email,
      attendance: attendedUserIdsSet.has(user.accountId)
    }));
  }
}