import TrainingService from "../services/TrainingService.js";
import { validateCreateTraining } from "../schemas/TrainingSchema.js";
import TrainingModel from "../models/Training.js";
import TrainingDayModel from "../models/TrainingDay.js";
import SerieModel from "../models/Serie.js";
import AccountModel from "../models/Account.js";
import UserModel from "../models/User.js";

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
    try {
      // Validate request data
      const validation = validateCreateTraining(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrenamiento inválidos",
          errors: validation.error.format()
        });
      }

      const trainingData = validation.data;

      // Find user by email instead of using userId directly
      const account = await AccountModel.findOne({
        where: { email: trainingData.userEmail },
        include: [{
          model: UserModel,
          as: 'user'
        }]
      });

      if (!account || !account.user) {
        return res.status(404).json({
          success: false,
          message: `No user found with email: ${trainingData.userEmail}`
        });
      }

      // Get the actual userId from the found account
      const userId = account.user.accountId;

      // Set trainer ID from authenticated account if not provided
      if (!trainingData.trainerId) {
        trainingData.trainerId = req.account.id;
      }

      // Check if training exists for this user already
      const existingTraining = await TrainingModel.findByPk(userId);

      // If it exists, delete associated training days
      if (existingTraining) {
        const trainingDays = await TrainingDayModel.findAll({
          where: { userId: userId }
        });

        // Delete series for each training day
        for (const day of trainingDays) {
          await SerieModel.destroy({
            where: { idTrainingDay: day.id }
          });
        }

        // Delete training days
        await TrainingDayModel.destroy({
          where: { userId: userId }
        });
      }

      // Create or update the training record
      await TrainingModel.upsert({
        userId: userId,
        trainerId: trainingData.trainerId
      });

      // Process each training day
      const days = Object.keys(trainingData.days);

      for (const day of days) {
        // Create a training day record
        const trainingDay = await TrainingDayModel.create({
          day,
          userId: userId
        });

        // Process exercises for this day
        const exercises = trainingData.days[day].exercises;

        for (const exercise of exercises) {
          // Process series for this exercise
          for (const serie of exercise.series) {
            await SerieModel.create({
              idTrainingDay: trainingDay.id,
              idExercise: exercise.id,
              reps: serie.reps,
              weigth: serie.weight // Map 'weight' to 'weigth' to match model field name
            });
          }
        }
      }

      return res.status(201).json({
        success: true,
        message: "Plan de entrenamiento creado exitosamente",
        training: {
          userId: userId,
          trainerId: trainingData.trainerId,
          days: days.length,
          email: trainingData.userEmail
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
}