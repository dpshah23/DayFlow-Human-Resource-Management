"use server";

import prisma from "../prisma";

import { Prisma, AttendanceStatus } from "@/app/generated/prisma";

export const findAttendanceById = async (id: string) => {
  const attendance = await prisma.attendance.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return attendance;
};

export const findAttendancesByUserId = async (userId: string) => {
  const attendances = await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return attendances;
};

export type UpdateAttendanceData = {
  status?: AttendanceStatus;
  date?: Date;
  userId?: string;
};

export const updateAttendance = async (
  id: string,
  data: UpdateAttendanceData,
) => {
  const { userId, ...rest } = data;

  const updateData: Prisma.AttendanceUpdateInput = {
    ...rest,
    ...(userId && { user: { connect: { id: userId } } }),
  };

  const attendance = await prisma.attendance.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return attendance;
};

export async function findAllAttendances(options?: {
  where?: Prisma.AttendanceWhereInput;
}) {
  const where = options?.where || {};

  return await prisma.attendance.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function findAttendancesWithFilters(filters: {
  status?: string;
  search?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ attendances: any[]; total: number }> {
  try {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.date.lte = filters.dateTo;
      }
    }

    if (filters.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        take: filters.limit || 10,
        skip: filters.offset || 0,
        orderBy: { date: "desc" },
      }),
      prisma.attendance.count({ where }),
    ]);

    return { attendances, total };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch filtered attendances");
  }
}

export async function createAttendance(
  data: Prisma.AttendanceUncheckedCreateInput,
) {
  const attendance = await prisma.attendance.create({
    data,
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return attendance;
}

export const deleteAttendance = async (id: string) => {
  const { id: attendanceId } = await prisma.attendance.delete({
    where: { id },
  });

  return attendanceId;
};

export const bulkDeleteAttendances = async (ids: string[]) => {
  const resp = await prisma.attendance.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  return ids.length === resp.count ? ids : [];
};

export const markAttendance = async (data: {
  userId: string;
  date: Date;
  status: AttendanceStatus;
}) => {
  return await prisma.attendance.upsert({
    where: {
      userId_date: {
        userId: data.userId,
        date: data.date,
      },
    },
    update: {
      status: data.status,
    },
    create: {
      userId: data.userId,
      date: data.date,
      status: data.status,
    },
  });
};

/* ----------------------------------------
   EMPLOYEE VIEW (OWN ATTENDANCE)
---------------------------------------- */

export const getAttendanceByUser = async (userId: string) => {
  return await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

/* ----------------------------------------
   ADMIN VIEW (ALL ATTENDANCE)
---------------------------------------- */

export const getAttendanceForAdmin = async () => {
  return await prisma.attendance.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { date: "desc" },
  });
};
