import { z } from 'zod';
import { FORM_ERROR_MESSAGES } from './../config/constants.js';

export const loginSchema = z.object({
  email: z.string()
    .email(FORM_ERROR_MESSAGES.email.invalid)
    .max(255, FORM_ERROR_MESSAGES.email.maxLength),
  password: z.string()
    .min(6, FORM_ERROR_MESSAGES.password.minLength)
    .max(255, FORM_ERROR_MESSAGES.password.maxLength),
});

export const registrationSchema = z.object({
  username: z.string()
    .min(3, FORM_ERROR_MESSAGES.username.minLength)
    .max(255, FORM_ERROR_MESSAGES.username.maxLength),
  email: z.string()
    .email(FORM_ERROR_MESSAGES.email.invalid)
    .max(255, FORM_ERROR_MESSAGES.email.maxLength),
  password: z.string()
    .min(6, FORM_ERROR_MESSAGES.password.minLength)
    .max(255, FORM_ERROR_MESSAGES.password.maxLength),
  confirmPassword: z.string()
    .min(6, FORM_ERROR_MESSAGES.confirmPassword.minLength)
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: FORM_ERROR_MESSAGES.confirmPassword.mismatch,
      path: ["confirmPassword"],
    });
  }
});

export const validateLoginAccount = (data) => {
  return loginSchema.safeParse(data);
};

export const validateRegisterAccount = (data) => {
  return registrationSchema.safeParse(data);
};