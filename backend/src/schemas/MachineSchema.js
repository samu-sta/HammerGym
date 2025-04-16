import zod from 'zod';

const CreateMachineSchema = zod.object({
  serialNumber: zod.string().optional(),
  status: zod.enum(['available', 'inUse', 'broken', 'preparing', 'outOfService']).default('available'),
  machineModelId: zod.number().int().positive(),
  gymId: zod.number().int().positive()
});

const UpdateMachineSchema = zod.object({
  serialNumber: zod.string().optional(),
  status: zod.enum(['available', 'inUse', 'broken', 'preparing', 'outOfService']).optional(),
  machineModelId: zod.number().int().positive().optional(),
  gymId: zod.number().int().positive().optional()
});

function validateCreateMachine(data) {
  return CreateMachineSchema.safeParse(data);
}

function validateUpdateMachine(data) {
  return UpdateMachineSchema.safeParse(data);
}

const machineSchema = {
  validateCreateMachine,
  validateUpdateMachine
};

export default machineSchema;