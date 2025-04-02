import ExerciseModel from "../models/Exercise.js";

export default class ExercisesController {

  getExercises = async (req, res) => {
    try {
      console.log('Fetching exercises');
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
        message: "Error interno del servidor"
      });
    }
  }
}