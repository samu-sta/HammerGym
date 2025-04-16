import zod, { date } from 'zod';

const scheduleDaySchema = zod.object({
  day: zod.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startHour: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
  endHour: zod.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
}).refine(data => data.startHour < data.endHour, {
  message: "End hour must be after start hour",
  path: ["endHour"]
});

const dateStringToDate = zod.string().datetime()
  .transform((dateString) => new Date(dateString));

const scheduleSchema = zod.object({
  startDate: zod.union([zod.date(), dateStringToDate]),
  endDate: zod.union([zod.date(), dateStringToDate]),
  scheduleDays: zod.array(scheduleDaySchema).min(1)
}).refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate < endDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

const createClassSchema = zod.object({
  name: zod.string().min(3).max(255),
  description: zod.string().max(1000),
  maxCapacity: zod.number().int().positive(),
  difficulty: zod.enum(['low', 'medium', 'high']),
  schedule: scheduleSchema
});

const attendanceUserSchema = zod.object({
  username: zod.string().min(1)
});

// Removed date validation since we'll use server's current date
const recordAttendanceSchema = zod.object({
  date: zod.string().date(),
  classId: zod.number().int().positive(),
  users: zod.array(attendanceUserSchema)
});

const classAttendanceSchema = zod.object({
  date: zod.string().date()
});

export const validateCreateClass = (data) => {
  return createClassSchema.safeParse(data);
};

export const validateRecordAttendance = (data) => {
  return recordAttendanceSchema.safeParse(data);
};

export const validateClassAttendance = (data) => {
  return classAttendanceSchema.safeParse(data);
};