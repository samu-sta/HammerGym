import zod from 'zod';

const CreateExerciseSchema = zod.object({
  name: zod.string().min(1).max(255),
  description: zod.string().min(1).max(255),
  muscles: zod.enum(['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs'])
});

const UpdateExerciseSchema = zod.object({
  name: zod.string().min(1).max(255).optional(),
  description: zod.string().min(1).max(255).optional(),
  muscles: zod.enum(['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs']).optional()
});

export function validateCreateExercise(data) {
  return CreateExerciseSchema.safeParse(data);
}

export function validateUpdateExercise(data) {
  return UpdateExerciseSchema.safeParse(data);
}

const exercisesSchema = {
  validateCreateExercise,
  validateUpdateExercise
};

export default exercisesSchema;