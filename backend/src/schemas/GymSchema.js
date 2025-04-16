import zod from 'zod';

const CreateGymSchema = zod.object({
  telephone: zod.string().min(5),
  location: zod.string().min(3),
  maxCapacity: zod.number().int().positive(),
  currentOccupancy: zod.number().int().nonnegative().default(0)
});

const UpdateGymSchema = CreateGymSchema.partial();

function validateCreateGym(data) {
  return CreateGymSchema.safeParse(data);
}

function validateUpdateGym(data) {
  return UpdateGymSchema.safeParse(data);
}

const gymSchema = {
  validateCreateGym,
  validateUpdateGym
};

export default gymSchema;