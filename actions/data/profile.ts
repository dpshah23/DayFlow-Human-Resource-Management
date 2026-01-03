"use server";

import { revalidatePath } from "next/cache";

import {
  getUserProfile,
  updateUserProfile,
  UserProfilePayload,
} from "@/lib/db/profile";
import { UpdateProfileSchema } from "@/schemas/profile";
import { ActionResponse } from "@/types";

// -----------------------------
// Fetch user profile
// -----------------------------
export async function fetchUserProfileAction(
  userId: string,
): Promise<ActionResponse<UserProfilePayload>> {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  try {
    return await getUserProfile(userId);
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Failed to fetch profile",
    };
  }
}

// -----------------------------
// Update user profile
// -----------------------------
export async function updateUserProfileAction(
  userId: string,
  data: unknown,
): Promise<ActionResponse<UserProfilePayload>> {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  // Validate input against NEW schema
  const validation = UpdateProfileSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await updateUserProfile(userId, validation.data);

    if (response.success) {
      revalidatePath("/profile");
    }

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? "Failed to update profile",
    };
  }
}
