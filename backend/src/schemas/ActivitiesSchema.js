import zod from 'zod';
const CreateActivitySchema = zod.object({
  tipo: zod.enum(['Entry', 'Exit']),
  idGym: zod.number().int().positive(),
  idUser: zod.number().int().positive()
});

function validateCreateActivity(data) {
  return CreateActivitySchema.safeParse(data);
}

const activitiesSchema = {
  validateCreateActivity
};

export default activitiesSchema;