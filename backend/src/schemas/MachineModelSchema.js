import zod from 'zod';

const CreateMachineModelSchema = zod.object({
  name: zod.string().min(2),
  brand: zod.string().min(2),
  description: zod.string().optional()
});

const UpdateMachineModelSchema = CreateMachineModelSchema.partial();

function validateCreateMachineModel(data) {
  return CreateMachineModelSchema.safeParse(data);
}

function validateUpdateMachineModel(data) {
  return UpdateMachineModelSchema.safeParse(data);
}

const machineModelSchema = {
  validateCreateMachineModel,
  validateUpdateMachineModel
};

export default machineModelSchema;