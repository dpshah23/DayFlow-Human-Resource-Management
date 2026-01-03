// File: actions/data/leave.ts
"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/app/generated/prisma";
import { ActionResponse } from "@/types";
import {
  createLeave,
  updateLeave,
  deleteLeave,
  findLeavesByUserId,
  findAllLeaves,
  UpdateLeaveData,
  bulkDeleteLeaves,
} from "@/lib/db/leave";

export const applyLeaveAction = async (
  data: Prisma.LeaveUncheckedCreateInput,
): Promise<ActionResponse<any>> => {
  if (!data.userId || !data.startDate || !data.endDate || !data.leaveType) {
    return {
      success: false,
      message: "User, dates, and leave type are required",
    };
  }

  try {
    const createdLeave = await createLeave(data);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      message: "Leave application submitted successfully",
      data: createdLeave,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error applying for leave",
    };
  }
};

export const updateLeaveAction = async (
  id: string,
  data: UpdateLeaveData,
): Promise<ActionResponse<any>> => {
  if (!id) {
    return {
      success: false,
      message: "Leave ID is required",
    };
  }

  try {
    const updatedLeave = await updateLeave(id, data);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      message: "Leave updated successfully",
      data: updatedLeave,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error updating leave",
    };
  }
};

export const cancelLeaveAction = async (
  id: string,
): Promise<ActionResponse<string>> => {
  if (!id) {
    return {
      success: false,
      message: "Leave ID is required",
    };
  }

  try {
    await deleteLeave(id);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      data: id,
      message: "Leave cancelled successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error cancelling leave",
    };
  }
};

export const fetchUserLeavesAction = async (
  userId: string,
): Promise<ActionResponse<any[]>> => {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required",
    };
  }

  try {
    const leaves = await findLeavesByUserId(userId);

    return {
      success: true,
      data: leaves,
      message: "Leaves fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error fetching leaves",
    };
  }
};

export const fetchAllLeavesAction = async (): Promise<
  ActionResponse<any[]>
> => {
  try {
    const leaves = await findAllLeaves();

    return {
      success: true,
      data: leaves,
      message: "Leaves fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error fetching leaves",
    };
  }
};

export const bulkDeleteLeavesAction = async (
  ids: string[],
): Promise<ActionResponse<string[]>> => {
  if (!ids || ids.length === 0) {
    return {
      success: false,
      message: "Leave IDs are required",
    };
  }

  try {
    const deletedIds = await bulkDeleteLeaves(ids);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      data: deletedIds,
      message: "Leaves deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting leaves",
    };
  }
};

export const createLeaveAction = async (
  data: Prisma.LeaveUncheckedCreateInput,
): Promise<ActionResponse<any>> => {
  if (!data.userId || !data.startDate || !data.endDate || !data.leaveType) {
    return {
      success: false,
      message: "User, dates, and leave type are required",
    };
  }

  try {
    const createdLeave = await createLeave(data);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      message: "Leave created successfully",
      data: createdLeave,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error creating leave",
    };
  }
};

export const deleteLeaveAction = async (
  id: string,
): Promise<ActionResponse<string>> => {
  if (!id) {
    return {
      success: false,
      message: "Leave ID is required",
    };
  }

  try {
    const leaveId = await deleteLeave(id);

    revalidatePath("/profile/leaves");
    revalidatePath("/admin/leaves");

    return {
      success: true,
      data: leaveId,
      message: "Leave deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting leave",
    };
  }
};
