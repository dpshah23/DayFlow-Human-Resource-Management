// File: actions/data/employee.ts
"use server";

import { revalidatePath } from "next/cache";

import { ActionResponse } from "@/types";
import {
  bulkDeleteEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  UpdateEmployeeData,
} from "@/lib/db/employee";

export const createEmployeeAction = async (data: {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  role?: "ADMIN" | "EMPLOYEE";
  profile?: {
    employeeId: string;
    name: string;
    phone?: string;
    address?: string;
    salary?: number;
  };
}): Promise<ActionResponse<any>> => {
  if (!data.name || !data.email) {
    return {
      success: false,
      message: "Name and email are required",
    };
  }

  if (data.profile && !data.profile.employeeId) {
    return {
      success: false,
      message: "Employee ID is required",
    };
  }

  try {
    const createdEmployee = await createEmployee(data);

    revalidatePath("/admin/employees");

    return {
      success: true,
      message: "Employee created successfully",
      data: createdEmployee,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error creating employee",
    };
  }
};

export const updateEmployeeAction = async (
  id: string,
  data: UpdateEmployeeData,
): Promise<ActionResponse<any>> => {
  if (!id) {
    return {
      success: false,
      message: "Employee ID is required",
    };
  }

  try {
    const updatedEmployee = await updateEmployee(id, data);

    revalidatePath("/admin/employees");

    return {
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error updating employee",
    };
  }
};

export const deleteEmployeeAction = async (
  id: string,
): Promise<ActionResponse<string>> => {
  if (!id) {
    return {
      success: false,
      message: "Employee ID is required",
    };
  }

  try {
    const employeeId = await deleteEmployee(id);

    revalidatePath("/admin/employees");

    return {
      success: true,
      data: employeeId,
      message: "Employee deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting employee",
    };
  }
};

export const bulkDeleteEmployeesAction = async (
  ids: string[],
): Promise<ActionResponse<string[]>> => {
  if (!ids || ids.length === 0) {
    return {
      success: false,
      message: "Employee IDs are required",
    };
  }

  try {
    const deletedIds = await bulkDeleteEmployees(ids);

    revalidatePath("/admin/employees");

    return {
      success: true,
      data: deletedIds,
      message: "Employees deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error deleting employees",
    };
  }
};
