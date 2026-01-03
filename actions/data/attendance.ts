"use server";

import { revalidatePath } from "next/cache";

import { Attendance } from "@/app/generated/prisma";
import { Prisma } from "@/app/generated/prisma";
import { ActionResponse } from "@/types";
import {
  bulkDeleteAttendances,
  createAttendance,
  deleteAttendance,
  updateAttendance,
  UpdateAttendanceData,
} from "@/lib/db/attendance";

export const createAttendanceAction = async (
  data: Prisma.AttendanceUncheckedCreateInput,
): Promise<ActionResponse<Attendance>> => {
  if (!data.userId || !data.date || !data.status) {
    return {
      success: false,
      message: "User, date, and status are required",
    };
  }
  try {
    const createdAttendance = await createAttendance(data);

    revalidatePath("/admin/attendance");

    return {
      success: true,
      message: "Attendance created successfully",
      data: createdAttendance,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error creating attendance",
    };
  }
};

export const updateAttendanceAction = async (
  id: string,
  data: UpdateAttendanceData,
): Promise<ActionResponse<Attendance>> => {
  if (!id) {
    return {
      success: false,
      message: "Attendance ID is required",
    };
  }

  try {
    const updatedAttendance = await updateAttendance(id, data);

    revalidatePath("/admin/attendance");

    return {
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error updating attendance",
    };
  }
};

export const deleteAttendanceAction = async (
  id: string,
): Promise<ActionResponse<string>> => {
  if (!id) {
    return {
      success: false,
      message: "Attendance ID is required",
    };
  }

  try {
    const attendanceId = await deleteAttendance(id);

    revalidatePath("/admin/attendance");

    return {
      success: true,
      data: attendanceId,
      message: "Attendance deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting attendance",
    };
  }
};

export const bulkDeleteAttendancesAction = async (
  ids: string[],
): Promise<ActionResponse<string[]>> => {
  if (!ids || ids.length === 0) {
    return {
      success: false,
      message: "Attendance IDs are required",
    };
  }

  try {
    const deletedIds = await bulkDeleteAttendances(ids);

    revalidatePath("/admin/attendance");

    return {
      success: true,
      data: deletedIds,
      message: "Attendances deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting attendances",
    };
  }
};
