import TrainingModel from '../models/Training.js';
import TrainingDayModel from '../models/TrainingDay.js';
import SerieModel from '../models/Serie.js';
import ExerciseModel from '../models/Exercise.js';
import AccountModel from '../models/Account.js';
import UserModel from '../models/User.js';

export default class TrainingService {

  fetchUserTraining = async (userId) => {
    return await TrainingModel.findByPk(userId, {
      include: [
        {
          model: TrainingDayModel,
          as: 'trainingDays',
          include: [
            {
              model: SerieModel,
              as: 'series',
              include: [
                {
                  model: ExerciseModel,
                  as: 'exercise'
                }
              ]
            }
          ]
        }
      ]
    });
  }

  formatTrainingData(rawTraining) {
    const training = {
      userId: rawTraining.userId,
      trainerId: rawTraining.trainerId,
      days: {}
    };

    rawTraining.trainingDays.forEach(trainingDay => {
      training.days[trainingDay.day] = {
        exercises: this.formatExercises(trainingDay.series)
      };
    });

    return training;
  }

  mapSerieToSimpleFormat(serie) {
    return {
      reps: serie.reps,
      weight: serie.weigth
    };
  }

  createExerciseObject(serie) {
    return {
      id: serie.exercise.id,
      name: serie.exercise.name,
      description: serie.exercise.description,
      muscles: serie.exercise.muscles,
      series: []
    };
  }

  groupSeriesByExercise(series) {
    return series.reduce((map, serie) => {
      const exerciseId = serie.exercise.id;

      if (!map.has(exerciseId)) {
        map.set(exerciseId, this.createExerciseObject(serie));
      }

      map.get(exerciseId).series.push(this.mapSerieToSimpleFormat(serie));
      return map;
    }, new Map());
  }

  formatExercises(series) {
    const exercisesMap = this.groupSeriesByExercise(series);
    return Array.from(exercisesMap.values());
  }

  createUserTraining = async (trainingData) => {
    const { userId, days, trainerId } = trainingData;

    // First check if a training plan already exists for this user
    const existingTraining = await TrainingModel.findByPk(userId);
    if (existingTraining) {
      // If one exists, update it or delete associated data
      await TrainingDayModel.destroy({ where: { userId } });
    }

    // Create or update the training record
    const training = await TrainingModel.upsert({
      userId,
      trainerId
    });

    for (const day of Object.keys(days)) {
      const trainingDay = await TrainingDayModel.create({
        day,
        userId: userId
      });

      for (const exercise of days[day].exercises) {
        for (const serie of exercise.series) {
          await SerieModel.create({
            reps: serie.reps,
            weigth: serie.weight,
            idTrainingDay: trainingDay.id,
            idExercise: exercise.id
          });
        }
      }
    }

    return training;
  }

  fetchExercises = async () => {
    return await ExerciseModel.findAll({
      order: [['name', 'ASC']]
    });
  }

  fetchUserTrainingByEmail = async (userEmail) => {
    // Primero buscar la cuenta por email
    const account = await AccountModel.findOne({
      where: { email: userEmail },
      include: [{
        model: UserModel,
        as: 'user'
      }]
    });

    if (!account || !account.user) {
      return null;
    }

    // Obtener el userId desde la cuenta
    const userId = account.user.accountId;

    // Ahora buscar el entrenamiento por userId
    return await TrainingModel.findOne({
      where: { userId },
      include: [
        {
          model: TrainingDayModel,
          as: 'trainingDays',
          include: [
            {
              model: SerieModel,
              as: 'series',
              include: [
                {
                  model: ExerciseModel,
                  as: 'exercise'
                }
              ]
            }
          ]
        }
      ]
    });

  }
}