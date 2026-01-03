import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\+?[\d\s\-()]+$/, "Invalid phone format")
    .optional()
    .nullable(),

  address: z.string().optional().nullable(),

  salary: z
    .number()
    .int("Salary must be an integer")
    .nonnegative("Salary must be positive")
    .optional()
    .nullable(),
});

// Update Password Schema
export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
