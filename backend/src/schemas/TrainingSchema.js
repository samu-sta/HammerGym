import zod from 'zod';

const serieSchema = zod.object({
  reps: zod.number().int().positive(),
  weight: zod.number().positive()
});

const exerciseSchema = zod.object({
  id: zod.number().int().positive().optional(),
  name: zod.string().min(1).max(255),
  description: zod.string().max(255),
  muscles: zod.enum(['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs']),
  series: zod.array(serieSchema).nonempty()
});

const dayExercisesSchema = zod.object({
  exercises: zod.array(exerciseSchema).nonempty()
});

const createTrainingSchema = zod.object({
  userId: zod.number().int().positive(),
  trainerId: zod.number().int().positive().optional(),
  days: zod.record(
    zod.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    dayExercisesSchema
  ).refine(days => Object.keys(days).length > 0, {
    message: "At least one training day must be provided"
  })
});

export const validateCreateTraining = (data) => {
  return createTrainingSchema.safeParse(data);
};

export const validateUpdateTraining = (data) => {
  const updateTrainingSchema = createTrainingSchema.partial();
  return updateTrainingSchema.safeParse(data);
};