import TrainingService from "../services/TrainingService.js";
import { validateCreateTraining } from "../schemas/TrainingSchema.js";
import TrainingModel from "../models/Training.js";
import TrainingDayModel from "../models/TrainingDay.js";
import SerieModel from "../models/Serie.js";
export default class TrainingController {

  constructor() {
    this.trainingService = new TrainingService();
  }

  getUserAsignedTraining = async (req, res) => {
    try {
      const { id } = req.account;

      const rawTraining = await this.trainingService.fetchUserTraining(id);

      if (!rawTraining) {
        return res.status(404).json({
          success: false,
          message: "No tienes entrenamientos asignados"
        });
      }

      const training = this.trainingService.formatTrainingData(rawTraining);

      return res.status(200).json({
        success: true,
        training
      });

    }
    catch (error) {
      console.error('Error al obtener entrenamiento:', error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }

  createUserTraining = async (req, res) => {
    console.log('Creating user training plan');
    try {
      // Log the request body to debug
      console.log('Request body:', JSON.stringify(req.body));

      // Validate request data
      const validation = validateCreateTraining(req.body);

      if (!validation.success) {
        console.log('Validation failed:', validation.error.format());
        return res.status(400).json({
          success: false,
          message: "Datos de entrenamiento inválidos",
          errors: validation.error.format()
        });
      }

      const trainingData = validation.data;

      // Set trainer ID from authenticated account if not provided
      if (!trainingData.trainerId) {
        trainingData.trainerId = req.account.id;
      }

      // Create the main training record
      const training = await TrainingModel.create({
        userId: trainingData.userId,
        trainerId: trainingData.trainerId
      });

      // Process each training day
      const days = Object.keys(trainingData.days);

      for (const day of days) {
        // Create a training day record
        const trainingDay = await TrainingDayModel.create({
          day,
          trainingId: training.id
        });

        // Process exercises for this day
        const exercises = trainingData.days[day].exercises;

        for (const exercise of exercises) {
          // Process series for this exercise
          for (const serie of exercise.series) {
            // Fix: Map 'weight' to 'weigth' (matching the model field name)
            await SerieModel.create({
              idTrainingDay: trainingDay.id,
              idExercise: exercise.id,
              reps: serie.reps,
              weigth: serie.weight // Note: We map 'weight' to 'weigth' here
            });
          }
        }
      }

      return res.status(201).json({
        success: true,
        message: "Plan de entrenamiento creado exitosamente",
        training: {
          id: training.id,
          userId: training.userId,
          trainerId: training.trainerId,
          days: days.length
        }
      });
    } catch (error) {
      console.error('Error creating training plan:', error);

      // Handle specific error types
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          success: false,
          message: "Error de referencia: El usuario o ejercicio especificado no existe"
        });
      }

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos: " + error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }

  getExercises = async (req, res) => {
    try {
      const exercises = this.trainingService.fetchExercises();

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