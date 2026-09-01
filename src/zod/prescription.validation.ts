import z from "zod";

export const createPrescriptionSchema = z.object({
appointmentId: z.uuid(),

healthIssue: z
.string()
.min(3, "Health issue must be at least 3 characters"),

givenTest: z
.string()
.optional(),

instructions: z
.string()
.min(10, "Instructions must be at least 10 characters"),

followUpDate: z.string().optional(),
});
