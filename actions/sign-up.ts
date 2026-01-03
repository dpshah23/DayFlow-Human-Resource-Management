"use server";

import { User } from "better-auth/*";
import z from "zod";

import { findUserByEmail, updateUser } from "@/lib/db/user";
import { ActionResponse } from "@/types";
import { RegisterSchema } from "@/schemas";
import { auth } from "@/lib/auth";
import { DEFAULT_REDIRECT_URL } from "@/lib/route";
import prisma from "@/lib/prisma";
import { Role } from "@/app/generated/prisma";

type SignUpActionOptions = {
  redirectTo?: string;
};

export const signUpAction = async (
  data: z.infer<typeof RegisterSchema>,
  options?: SignUpActionOptions,
): Promise<ActionResponse<User | null> & { redirectTo?: string | null }> => {
  try {
    const parsed = RegisterSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid data input",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, employeeId, email, password, isAdmin } = parsed.data;

    // Check email
    const existingByEmail = await findUserByEmail(email);

    if (existingByEmail) {
      return {
        success: false,
        message: "User already exists",
        fieldErrors: { email: ["User with this email already exists"] },
      };
    }

    // Check employeeId
    const existingByEmployeeId = await prisma.profile.findUnique({
      where: { employeeId },
    });

    if (existingByEmployeeId) {
      return {
        success: false,
        message: "Employee already exists",
        fieldErrors: {
          employeeId: ["Employee ID already exists"],
        },
      };
    }

    // Create auth user
    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: options?.redirectTo || DEFAULT_REDIRECT_URL,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }

    // Attach profile
    const updatedUser = await updateUser(user.id, {
      role: isAdmin ? Role.ADMIN : Role.EMPLOYEE,
      profile: {
        create: {
          employeeId,
          name,
        },
      },
    });

    return {
      success: true,
      message: "Sign-up successful",
      data: updatedUser,
      redirectTo: options?.redirectTo || null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "An unknown error occurred",
    };
  }
};
