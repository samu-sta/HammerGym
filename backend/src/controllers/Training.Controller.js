import TrainingService from "../services/TrainingService.js";
import { validateCreateTraining } from "../schemas/TrainingSchema.js";
import TrainingModel from "../models/Training.js";
import TrainingDayModel from "../models/TrainingDay.js";
import SerieModel from "../models/Serie.js";
import AccountModel from "../models/Account.js";
import UserModel from "../models/User.js";
import ExerciseModel from "../models/Exercise.js";

export default class TrainingController {

  constructor() {
    this.trainingService = new TrainingService();
  }

  getUserAsignedTraining = async (req, res) => {
    try {
      const { id } = req.account;
      console.log("ID del usuario:", id);

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

      const userId = account.user.accountId;

      if (!trainingData.trainerId) {
        trainingData.trainerId = req.account.id;
      }

      const existingTraining = await TrainingModel.findByPk(userId);

      if (existingTraining) {
        const trainingDays = await TrainingDayModel.findAll({
          where: { userId: userId }
        });

        for (const day of trainingDays) {
          await SerieModel.destroy({
            where: { idTrainingDay: day.id }
          });
        }

        await TrainingDayModel.destroy({
          where: { userId: userId }
        });
      }

      await TrainingModel.upsert({
        userId: userId,
        trainerId: trainingData.trainerId
      });

      const days = Object.keys(trainingData.days);

      for (const day of days) {
        const trainingDay = await TrainingDayModel.create({
          day,
          userId: userId
        });

        const exercises = trainingData.days[day].exercises;

        for (const exercise of exercises) {
          for (const serie of exercise.series) {
            await SerieModel.create({
              idTrainingDay: trainingDay.id,
              idExercise: exercise.id,
              reps: serie.reps,
              weigth: serie.weight
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

  getTrainingByUserEmail = async (req, res) => {
    try {
      const { userEmail } = req.params;

      const rawTraining = await this.trainingService.fetchUserTrainingByEmail(userEmail);

      if (!rawTraining) {
        return res.status(404).json({
          success: false,
          message: `No se encontró entrenamiento para el usuario con email: ${userEmail}`
        });
      }

      const training = this.trainingService.formatTrainingData(rawTraining);

      return res.status(200).json({
        success: true,
        training
      });

    } catch (error) {
      console.error('Error fetching training by user email:', error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
}
