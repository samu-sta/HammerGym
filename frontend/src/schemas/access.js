import {z} from 'zod';
import {FORM_ERROR_MESSAGES} from './../config/constants.js';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
}).superRefine((data, ctx) => {
  if (!data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FORM_ERROR_MESSAGES.email.required,
      path: ["email"],
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FORM_ERROR_MESSAGES.email.invalid,
      path: ["email"],
    });
  }

  if (!data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FORM_ERROR_MESSAGES.password.required,
      path: ["password"],
    });
  } else if (data.password.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FORM_ERROR_MESSAGES.password.invalid,
      path: ["password"],
    });
  }
});