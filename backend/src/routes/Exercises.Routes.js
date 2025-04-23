import { Router } from 'express';
import ExercisesController from '../controllers/Exercises.Controller.js';
import { authAdmin } from '../middleware/auth.js';

export const ExercisesRoutes = () => {
  const exercisesRouter = Router();
  const exercisesController = new ExercisesController();

  // Ruta pública para obtener ejercicios
  exercisesRouter.get('/', exercisesController.getExercises);

  // Rutas protegidas para admin (crear, actualizar, eliminar)
  exercisesRouter.post('/', authAdmin, exercisesController.createExercise);
  exercisesRouter.put('/:id', authAdmin, exercisesController.updateExercise);
  exercisesRouter.delete('/:id', authAdmin, exercisesController.deleteExercise);

  return exercisesRouter;
}