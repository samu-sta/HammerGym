import { z } from 'zod';
import { FORM_ERROR_MESSAGES } from './../config/constants.js';

const commonSuperRefine = (data, ctx) => {
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

  if (data.confirmPassword !== undefined) {
    if (!data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La confirmación de la contraseña es requerida',
        path: ["confirmPassword"],
      });
    } else if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ["confirmPassword"],
      });
    }
  }

  if (data.nombre !== undefined && !data.nombre) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre es requerido',
      path: ["nombre"],
    });
  }

  if (data.apellido !== undefined && !data.apellido) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Los apellidos son requeridos',
      path: ["apellido"],
    });
  }

  if (data.nombreUsuario !== undefined && !data.nombreUsuario) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre de usuario es requerido',
      path: ["nombreUsuario"],
    });
  }

  if (data.role !== undefined && !['Usuario', 'Entrenador'].includes(data.role)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El rol es requerido',
      path: ["role"],
    });
  }
};

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
}).superRefine((data, ctx) => commonSuperRefine(data, ctx));

export const registrationSchema = z.object({
  role: z.enum(['Usuario', 'Entrenador']),
  nombre: z.string(),
  apellido: z.string(),
  nombreUsuario: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => commonSuperRefine(data, ctx));