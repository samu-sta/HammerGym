import zod from 'zod';

const CreateActivitySchema = zod.object({
  type: zod.enum(['Entry', 'Exit']),
  gymId: zod.number().int().positive(),
});

function validateCreateActivity(data) {
  return CreateActivitySchema.safeParse(data);
}

const activitiesSchema = {
  validateCreateActivity
};

export default activitiesSchema;