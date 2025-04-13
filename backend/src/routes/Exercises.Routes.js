import { Router } from 'express';
import ExercisesController from '../controllers/Exercises.Controller.js';

export const ExercisesRoutes = () => {
  const exercisesRouter = Router();
  const exercisesController = new ExercisesController();

  exercisesRouter.get('/', exercisesController.getExercises);

  return exercisesRouter;
}