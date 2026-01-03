"use server";

import { z } from "zod";

import { LoginSchema } from "@/schemas";
import { auth } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db/user";
import { ActionResponse } from "@/types";
import { User } from "@/app/generated/prisma";

type SignInActionOptions = {
  redirectTo?: string;
};
export const signInAction = async (
  data: z.infer<typeof LoginSchema>,
  options?: SignInActionOptions,
): Promise<ActionResponse<User | null> & { redirectTo?: string | null }> => {
  try {
    const safeData = LoginSchema.safeParse(data);

    if (!safeData.success) {
      return {
        success: false,
        message: "Invalid input data",
        fieldErrors: safeData.error.flatten().fieldErrors,
      };
    }

    const { email, password } = safeData.data;

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
        fieldErrors: { email: ["User with this email does not exist"] },
      };
    }

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    return {
      success: response.ok,
      message: response.ok
        ? "Successfully signed in"
        : "Invalid email or password",
      redirectTo: options?.redirectTo || null,
    };
  } catch (error: any) {
    // console.error("Sign-in action error:", error);

    return {
      success: false,
      message: error.message || "An error occurred during sign-in",
    };
  }
};
