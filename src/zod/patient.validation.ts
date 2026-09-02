import z from "zod";

// Health Data Update Validation
export const updateHealthDataSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .optional(),
  hasAllergies: z.boolean().optional(),
  hasDiabetes: z.boolean().optional(),
  height: z.string().min(1, "Height is required").optional(),
  weight: z.string().min(1, "Weight is required").optional(),
  smokingStatus: z.boolean().optional(),
  dietaryPreferences: z.string().optional(),
  pregnancyStatus: z.boolean().optional(),
  mentalHealthHistory: z.string().optional(),
  immunizationStatus: z.string().optional(),
  hasPastSurgeries: z.boolean().optional(),
  recentAnxiety: z.boolean().optional(),
  recentDepression: z.boolean().optional(),
  maritalStatus: z.enum(["MARRIED", "UNMARRIED"]).optional(),
});

// Medical Report Upload Validation
export const uploadMedicalReportSchema = z.object({
  reportName: z.string().min(1, "Report name is required"),
  report: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "Only JPEG, PNG, and PDF files are allowed",
    ),
});

export type UpdateHealthDataInput = z.infer<typeof updateHealthDataSchema>;
export type UploadMedicalReportInput = z.infer<typeof uploadMedicalReportSchema>;
