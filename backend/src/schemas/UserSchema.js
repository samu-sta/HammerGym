import zod from 'zod';

const RegisterUserSchema = zod.object({
  username: zod.string().min(3).max(255),
  email: zod.string().email().max(255),
  password: zod.string().min(6).max(255),
  realName: zod.string().min(2).max(255),
  lastNames: zod.string().min(2).max(255),
  role: zod.enum(['Usuario', 'Entrenador'])
});

const LoginUserSchema = zod.object({
  email: zod.string().email().max(255),
  password: zod.string().min(6).max(255),
});

function validateRegisterUser(data) {
  return RegisterUserSchema.safeParse(data);
}

function validateLoginUser(data) {
  return LoginUserSchema.safeParse(data);
}


const userSchema = {
  validateRegisterUser,
  validateLoginUser,
};

export default userSchema;