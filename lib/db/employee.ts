"use server";

import prisma from "../prisma";

import { LeaveStatus, LeaveType, Prisma } from "@/app/generated/prisma/client";

/* ----------------------------------------
   PROFILE
---------------------------------------- */

export const getEmployeeProfile = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};

/* ----------------------------------------
   ATTENDANCE
---------------------------------------- */

export const getEmployeeAttendance = async (
  userId: string,
  options?: {
    from?: Date;
    to?: Date;
  },
) => {
  return await prisma.attendance.findMany({
    where: {
      userId,
      ...(options?.from || options?.to
        ? {
            date: {
              ...(options.from ? { gte: options.from } : {}),
              ...(options.to ? { lte: options.to } : {}),
            },
          }
        : {}),
    },
    orderBy: { date: "desc" },
  });
};

/* ----------------------------------------
   LEAVES
---------------------------------------- */

export const getEmployeeLeaves = async (userId: string) => {
  return await prisma.leave.findMany({
    where: { userId },
    orderBy: { from: "desc" },
  });
};

export const applyLeave = async (data: {
  userId: string;
  type: LeaveType;
  from: Date;
  to: Date;
  reason?: string;
}) => {
  return await prisma.leave.create({
    data: {
      userId: data.userId,
      type: data.type,
      from: data.from,
      to: data.to,
      reason: data.reason,
      status: LeaveStatus.PENDING,
    },
  });
};

/* ----------------------------------------
   DASHBOARD SUMMARY (OPTIMIZED)
---------------------------------------- */

export const getEmployeeDashboardData = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      profile: true,
      attendance: {
        orderBy: { date: "desc" },
        take: 5,
      },
      leaves: {
        orderBy: { from: "desc" },
        take: 5,
      },
    },
  });
};

/* ----------------------------------------
   RECENT ACTIVITY (DERIVED)
---------------------------------------- */

export const getEmployeeRecentActivity = async (userId: string) => {
  const [attendance, leaves] = await Promise.all([
    prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.leave.findMany({
      where: { userId },
      orderBy: { from: "desc" },
      take: 3,
    }),
  ]);

  const attendanceActivity = attendance.map((a) => ({
    type: "ATTENDANCE" as const,
    date: a.date,
    message: `Attendance marked as ${a.status}`,
  }));

  const leaveActivity = leaves.map((l) => ({
    type: "LEAVE" as const,
    date: l.from,
    message: `Leave ${l.status.toLowerCase()} (${l.type})`,
  }));

  return [...attendanceActivity, ...leaveActivity]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
};

export const findEmployeeById = async (id: string) => {
  const employee = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      attendance: {
        orderBy: { date: "desc" },
        take: 10,
      },
      leaves: {
        orderBy: { from: "desc" },
        take: 10,
      },
    },
  });

  return employee;
};

export const findAllEmployees = async (options?: {
  where?: Prisma.UserWhereInput;
}) => {
  const where = options?.where || {};

  return await prisma.user.findMany({
    where: {
      ...where,
      // Only get employees, not admins
    },
    include: {
      profile: true,
      _count: {
        select: {
          attendance: true,
          leaves: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findEmployeesWithFilters = async (filters: {
  role?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ employees: any[]; total: number }> => {
  try {
    const where: Prisma.UserWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        {
          profile: {
            employeeId: { contains: filters.search, mode: "insensitive" },
          },
        },
        {
          profile: {
            phone: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: true,
          _count: {
            select: {
              attendance: true,
              leaves: true,
            },
          },
        },
        take: filters.limit || 10,
        skip: filters.offset || 0,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { employees, total };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch filtered employees");
  }
};

export type UpdateEmployeeData = {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string;
  role?: "ADMIN" | "EMPLOYEE";
  profile?: {
    employeeId?: string;
    name?: string;
    phone?: string;
    address?: string;
    salary?: number;
  };
};

export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  const { profile, ...userData } = data;

  const employee = await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      ...(profile && {
        profile: {
          upsert: {
            create: {
              employeeId: profile.employeeId || "",
              name: profile.name || "",
              phone: profile.phone,
              address: profile.address,
              salary: profile.salary,
            },
            update: profile,
          },
        },
      }),
    },
    include: {
      profile: true,
      _count: {
        select: {
          attendance: true,
          leaves: true,
        },
      },
    },
  });

  return employee;
};

export async function createEmployee(data: {
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
}) {
  const { profile, ...userData } = data;

  const employee = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      ...userData,
      role: userData.role || "EMPLOYEE",
      emailVerified: userData.emailVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(profile && {
        profile: {
          create: {
            employeeId: profile.employeeId,
            name: profile.name,
            phone: profile.phone,
            address: profile.address,
            salary: profile.salary,
          },
        },
      }),
    },
    include: {
      profile: true,
      _count: {
        select: {
          attendance: true,
          leaves: true,
        },
      },
    },
  });

  return employee;
}

export const deleteEmployee = async (id: string) => {
  // First delete related data
  await prisma.attendance.deleteMany({
    where: { userId: id },
  });

  await prisma.leave.deleteMany({
    where: { userId: id },
  });

  await prisma.profile.deleteMany({
    where: { userId: id },
  });

  // Then delete the employee
  const { id: employeeId } = await prisma.user.delete({
    where: { id },
  });

  return employeeId;
};

export const bulkDeleteEmployees = async (ids: string[]) => {
  // Delete related data first
  await prisma.attendance.deleteMany({
    where: { userId: { in: ids } },
  });

  await prisma.leave.deleteMany({
    where: { userId: { in: ids } },
  });

  await prisma.profile.deleteMany({
    where: { userId: { in: ids } },
  });

  // Then delete employees
  const resp = await prisma.user.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  return ids.length === resp.count ? ids : [];
};
