"use server";

import prisma from "../prisma";

import { ActionResponse } from "@/types";
import { Prisma, Profile } from "@/app/generated/prisma";

/* ----------------------------------------
   VIEW PROFILE
---------------------------------------- */

export const getProfileByUserId = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};

/* ----------------------------------------
   EMPLOYEE EDIT (LIMITED FIELDS)
---------------------------------------- */

export const updateOwnProfile = async (
  userId: string,
  data: {
    phone?: string;
    address?: string;
    image?: string;
  },
) => {
  return await prisma.profile.update({
    where: { userId },
    data,
  });
};

/* ----------------------------------------
   ADMIN EDIT (FULL CONTROL)
---------------------------------------- */

export const adminUpdateProfile = async (
  profileId: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    salary?: number;
  },
) => {
  return await prisma.profile.update({
    where: { id: profileId },
    data,
  });
};

/**
 * Strongly typed payload for user profile
 */
export type UserProfilePayload = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

// -----------------------------
// Get user profile
// -----------------------------
export async function getUserProfile(
  userId: string,
): Promise<ActionResponse<UserProfilePayload>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      message: "Profile fetched successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);

    return { success: false, message: "Failed to fetch profile" };
  }
}

// -----------------------------
// Update user + profile
// -----------------------------
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string | null;
    address?: string | null;
    salary?: number | null;
  },
): Promise<ActionResponse<UserProfilePayload>> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        // update User.name if provided
        ...(data.name && { name: data.name }),

        // update Profile safely
        profile: {
          upsert: {
            update: {
              ...(data.name && { name: data.name }),
              ...(data.phone !== undefined && { phone: data.phone }),
              ...(data.address !== undefined && { address: data.address }),
              ...(data.salary !== undefined && { salary: data.salary }),
            },
            create: {
              name: data.name ?? "Unnamed",
              phone: data.phone ?? null,
              address: data.address ?? null,
              salary: data.salary ?? null,
              employeeId: crypto.randomUUID(), // fallback (normally already exists)
            },
          },
        },
      },
      include: { profile: true },
    });

    return {
      success: true,
      message: "Profile updated successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    return { success: false, message: "Failed to update profile" };
  }
}

// -----------------------------
// Update profile only (HR / Admin)
// -----------------------------
export async function updateEmployeeProfile(
  userId: string,
  data: Prisma.ProfileUpdateInput,
): Promise<ActionResponse<Profile>> {
  try {
    const profile = await prisma.profile.update({
      where: { userId },
      data,
    });

    return {
      success: true,
      message: "Employee profile updated successfully",
      data: profile,
    };
  } catch (error) {
    console.error("Error updating employee profile:", error);

    return { success: false, message: "Failed to update employee profile" };
  }
}

// -----------------------------
// Delete profile (rare, admin only)
// -----------------------------
export async function deleteUserProfile(
  userId: string,
): Promise<ActionResponse<null>> {
  try {
    await prisma.profile.delete({
      where: { userId },
    });

    return {
      success: true,
      message: "Profile deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting profile:", error);

    return { success: false, message: "Failed to delete profile" };
  }
}
