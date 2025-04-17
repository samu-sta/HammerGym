import zod from 'zod';

const UpdateUserSchema = zod.object({
  username: zod.string().min(3).max(255).optional(),
  email: zod.string().email().max(255).optional(),

});

function validateUpdateUser(data) {
  return UpdateUserSchema.safeParse(data);
}

const updateUserSchema = {
  validateUpdateUser
};

export default updateUserSchema;