import zod from 'zod';

const createProgressUserSchema = zod.object({
  date: zod.date(),
  howWasIt: zod.enum(['reallyEasy', 'easy', 'medium', 'hard', 'reallyHard']),
  observations: zod.string().max(255).optional()
});

export const validateCreateProgressUser = (data) => {
  return createProgressUserSchema.safeParse(data);
}