import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string({ invalid_type_error: "Email must be a string" })
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    employeeId: z
      .string()
      .min(1, { message: "Employee ID is required" })
      .regex(/^\d+$/, { message: "Employee ID must be digits only" })
      .max(7, { message: "Employee ID must be 7 digits" }),
    password: z
      .string()
      .min(6, { message: "Minimum 6 characters required" })
      .refine(
        (password) => {
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        },
        {
          message:
            "Password must include uppercase, lowercase, number and special character",
        },
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    isAdmin: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Show the error on the confirmPassword field
  });

export const ApplyLeaveSchema = z
  .object({
    leaveType: z.enum(["SICK", "CASUAL", "ANNUAL", "UNPAID"], {
      required_error: "Leave type is required",
    }),
    startDate: z.any().refine((val) => val !== undefined && val !== null, {
      message: "Start date is required",
    }),
    endDate: z.any().refine((val) => val !== undefined && val !== null, {
      message: "End date is required",
    }),
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters")
      .max(500),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      // Convert to Date objects for comparison
      const start = new Date(data.startDate.toString());
      const end = new Date(data.endDate.toString());

      return end >= start;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  ); // File: schemas/leave.ts
