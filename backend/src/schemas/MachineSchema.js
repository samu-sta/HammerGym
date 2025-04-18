import zod from 'zod';

const CreateMachineSchema = zod.object({
  serialNumber: zod.string().optional(),
  status: zod.enum(['available', 'broken', 'preparing', 'outOfService']).default('available'),
  machineModelId: zod.number().int().positive(),
  // gymId ya no se requiere ya que lo obtenemos de gymLocation
});

const UpdateMachineSchema = zod.object({
  serialNumber: zod.string().optional(),
  status: zod.enum(['available', 'broken', 'preparing', 'outOfService']).optional(),
  machineModelId: zod.number().int().positive().optional(),
  // gymId ya no se requiere ya que lo obtenemos de gymLocation
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