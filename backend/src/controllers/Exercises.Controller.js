import ExerciseModel from "../models/Exercise.js";
import MESSAGES from "../messages/messages.js";
import exercisesSchema from "../schemas/ExercisesSchema.js";

export default class ExercisesController {

  getExercises = async (req, res) => {
    try {
      const exercises = await ExerciseModel.findAll({
        order: [['name', 'ASC']]
      });

      return res.status(200).json({
        success: true,
        exercises
      });
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }

  createExercise = async (req, res) => {
    try {
      const result = exercisesSchema.validateCreateExercise(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.INVALID_DATA,
          errors: result.error.issues
        });
      }

      const { name, description, muscles } = result.data;

      const newExercise = await ExerciseModel.create({
        name,
        description,
        muscles
      });

      return res.status(201).json({
        success: true,
        exercise: newExercise
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }

  updateExercise = async (req, res) => {
    const { id } = req.params;

    try {
      const result = exercisesSchema.validateUpdateExercise(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.INVALID_DATA,
          errors: result.error.issues
        });
      }

      const exercise = await ExerciseModel.findByPk(id);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.USER_NOT_FOUND
        });
      }

      await exercise.update(result.data);

      return res.status(200).json({
        success: true,
        exercise
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }

  deleteExercise = async (req, res) => {
    const { id } = req.params;

    try {
      const exercise = await ExerciseModel.findByPk(id);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.USER_NOT_FOUND
        });
      }

      await exercise.destroy();

      return res.status(200).json({
        success: true,
        message: MESSAGES.EXERCISE_DELETED
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.ERROR_500
      });
    }
  }
}