import TrainingModel from '../models/Training.js';
import TrainingDayModel from '../models/TrainingDay.js';
import SerieModel from '../models/Serie.js';
import ExerciseModel from '../models/Exercise.js';

export default class TrainingService {

  fetchUserTraining = async (userId) => {
    return await TrainingModel.findOne({
      where: {
        userId
      },
      order: [['createdAt', 'DESC']],
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
      id: rawTraining.id,
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
    const { userId, days } = trainingData;

    const training = await TrainingModel.create({ userId });

    for (const day of Object.keys(days)) {
      const trainingDay = await TrainingDayModel.create({ day, trainingId: training.id });

      for (const exercise of days[day].exercises) {
        for (const serie of exercise.series) {
          await SerieModel.create({
            reps: serie.reps,
            weigth: serie.weight,
            trainingDayId: trainingDay.id,
            exerciseId: exercise.id
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

}