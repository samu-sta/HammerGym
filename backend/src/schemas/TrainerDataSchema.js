import Joi from 'joi';

// Schema para obtener datos completos de usuario
export const getUserCompleteDataSchema = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El userId debe ser un número',
      'number.integer': 'El userId debe ser un número entero',
      'number.positive': 'El userId debe ser un número positivo',
      'any.required': 'El userId es requerido'
    })
});
