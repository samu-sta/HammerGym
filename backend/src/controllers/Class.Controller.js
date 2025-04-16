import MESSAGES from "../messages/messages.js";
import ClassService from "../services/ClassService.js";
import { validateCreateClass, validateRecordAttendance, validateClassAttendance } from "../schemas/ClassSchema.js";
import AccountModel from "../models/Account.js";

export default class ClassController {
  constructor() {
    this.classService = new ClassService();
  }

  getAllClasses = async (_req, res) => {
    try {
      const classes = await this.classService.getAllClasses();
      return res.status(200).json({ success: true, classes });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  enrollInClass = async (req, res) => {
    const classId = req.body.classId;
    const userId = req.account.id;

    try {
      await this.classService.enrollUserInClass(classId, userId);
      return res.status(200).json({ success: true });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  };

  unenrollFromClass = async (req, res) => {
    const classId = req.body.classId;
    const userId = req.account.id;

    try {
      await this.classService.unenrollUserFromClass(classId, userId);
      return res.status(200).json({ success: true });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  createClass = async (req, res) => {
    const trainerId = req.account.id;

    const validationResult = validateCreateClass(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_DATA,
        errors: validationResult.error.format()
      });
    }

    try {
      const newClass = await this.classService.createClass(validationResult.data, trainerId);

      return res.status(201).json({
        success: true
      });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  };

  getTrainerClasses = async (req, res) => {
    const trainerId = req.account.id;

    try {
      const classes = await this.classService.getTrainerClasses(trainerId);
      return res.status(200).json({ success: true, classes });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteClass = async (req, res) => {
    const classId = req.params.classId;

    try {
      await this.classService.deleteClass(classId);
      return res.status(200).json({ success: true });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  };

  getUserClasses = async (req, res) => {
    try {
      const classes = await this.classService.getUserClasses(req.account.id);
      return res.status(200).json({ success: true, classes });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  };

  recordAttendance = async (req, res) => {
    const result = validateRecordAttendance(req.body);

    if (!result.success) {
      throw { status: 400, messages: MESSAGES.INVALID_DATA };
    }

    try {
      await this.classService.recordAttendance(result.data.classId, result.data);
      return res.status(200).json({ success: true });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  }

  getClassUsers = async (req, res) => {
    const classId = req.params.classId;

    try {
      const classInstance = await this.classService.validateClassExists(classId);

      const users = await classInstance.getRegisteredUsers({
        include: [{ model: AccountModel, as: 'account' }]
      });

      const formattedUsers = users.map(user => ({
        username: user.account.username
      }));

      return res.status(200).json({
        success: true,
        users: formattedUsers
      });
    }
    catch (error) {
      return this.handleError(error, res);
    }
  }

  getClassAttendance = async (req, res) => {
    const { classId, date } = req.params;

    try {
      const validationResult = validateClassAttendance({ date });
      if (!validationResult.success) {
        throw { status: 400, messages: MESSAGES.INVALID_DATA };
      }

      const dateObj = new Date(date);
      await this.validateClassSchedule(classId, dateObj);

      const attendanceData = await this.classService.getClassAttendanceData(classId, date);

      return res.status(200).json({
        success: true,
        users: attendanceData
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  validateClassSchedule = async (classId, date) => {
    const classInstance = await this.classService.validateClassExists(classId);
    const dayOfWeek = this.classService.getDayOfWeek(date);

    this.classService.isDateWithinSchedule(classInstance, date);
    this.classService.isClassScheduledForDay(classInstance, dayOfWeek);

    return classInstance;
  }

  handleError = (error, res, customMessage) => {
    if (!error.status || !error.messages) {
      error.status = 500;
      error.messages = customMessage || error.message || MESSAGES.ERROR_500;
    }
    return res.status(error.status).json({
      success: false,
      message: error.messages
    });
  }
}