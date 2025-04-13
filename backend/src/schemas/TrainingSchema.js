import zod from 'zod';

// Schema for series data
const serieSchema = zod.object({
  reps: zod.number().int().positive(),
  weight: zod.number().positive()
});

// Schema for exercises with just ID (used in training creation)
const exerciseWithIdSchema = zod.object({
  id: zod.number().int().positive(),
  series: zod.array(serieSchema).nonempty()
});

// Schema for complete exercises (used in other contexts)
const exerciseSchema = zod.object({
  id: zod.number().int().positive(),
  name: zod.string().min(1).max(255),
  description: zod.string().max(255),
  muscles: zod.enum(['biceps', 'triceps', 'back', 'chest', 'shoulders', 'legs']),
  series: zod.array(serieSchema).nonempty()
});

// Schema for daily exercises in training plan
const dayExercisesSchema = zod.object({
  exercises: zod.array(exerciseWithIdSchema).nonempty()
});

// Schema for creating a new training plan
const createTrainingSchema = zod.object({
  userEmail: zod.string().email(),
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