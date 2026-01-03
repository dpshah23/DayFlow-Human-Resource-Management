"use server";

import { revalidatePath } from "next/cache";

import { User } from "@/app/generated/prisma";
import { Prisma } from "@/app/generated/prisma";
import { ActionResponse } from "@/types";
import {
  bulkDeleteUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/db/user";

export const createUserAction = async (
  data: Prisma.UserCreateInput,
): Promise<ActionResponse<User>> => {
  if (!data.name || !data.email) {
    return {
      success: false,
      message: "Name and email are required",
    };
  }
  try {
    const createdUser = await createUser(data);

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User created successfully",
      data: createdUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error creating user",
    };
  }
};

export const updateUserAction = async (
  id: string,
  data: Partial<User>,
): Promise<ActionResponse<User>> => {
  if (!id) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  try {
    const updatedUser = await updateUser(id, data);

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error updating user",
    };
  }
};

export const deleteUserAction = async (
  id: string,
): Promise<ActionResponse<string>> => {
  if (!id) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  try {
    const userId = await deleteUser(id);

    return {
      success: true,
      data: userId,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting user",
    };
  }
};

export const bulkDeleteUsersAction = async (
  ids: string[],
): Promise<ActionResponse<string[]>> => {
  if (!ids || ids.length === 0) {
    return {
      success: false,
      message: "User IDs are required",
    };
  }

  try {
    const deletedIds = await bulkDeleteUsers(ids);

    revalidatePath("/admin/users");

    return {
      success: true,
      data: deletedIds,
      message: "Users deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting users",
    };
  }
};
