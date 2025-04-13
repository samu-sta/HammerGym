import MESSAGES from "../messages/messages.js";
import ClassService from "../services/ClassService.js";
import classSchema from "../schemas/ClassSchema.js";

export default class ClassController {
  constructor() {
    this.classService = new ClassService();
  }

  getAllClasses = async (_req, res) => {
    try {
      const classes = await this.classService.getAllClasses();
      return res.status(200).json({ success: true, classes });
    } catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
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
      if (!error.status || !error.messages) {
        error.status = 500;
        error.messages = MESSAGES.ERROR_500;
      }
      return res.status(error.status).json({ success: false, message: error.messages });
    }
  };

  unenrollFromClass = async (req, res) => {
    const classId = req.body.classId;
    const userId = req.account.id;

    try {
      await this.classService.unenrollUserFromClass(classId, userId);
      return res.status(200).json({ success: true });
    } catch (error) {
      if (!error.status || !error.messages) {
        error.status = 500;
        error.messages = MESSAGES.ERROR_500;
      }
      return res.status(error.status).json({
        success: false,
        message: error.messages
      });
    }
  }

  createClass = async (req, res) => {
    const trainerId = req.account.id;

    const validationResult = classSchema.validateCreateClass(req.body);

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
      if (!error.status || !error.messages) {
        error.status = 500;
        error.messages = MESSAGES.ERROR_500;
      }
      return res.status(error.status).json({
        success: false,
        message: error.messages
      });
    }
  };

  getTrainerClasses = async (req, res) => {
    const trainerId = req.account.id;

    try {
      const classes = await this.classService.getTrainerClasses(trainerId);
      return res.status(200).json({ success: true, classes });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  deleteClass = async (req, res) => {
    const classId = req.params.classId;

    try {
      await this.classService.deleteClass(classId);
      return res.status(200).json({ success: true });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };

  getUserClasses = async (req, res) => {
    try {
      const classes = await this.classService.getUserClasses(req.account.id);
      return res.status(200).json({ success: true, classes });
    }
    catch (error) {
      return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
  };
}