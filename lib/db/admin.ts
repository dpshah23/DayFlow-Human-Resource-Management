"use server";

import prisma from "../prisma";
import {
  AttendanceStatus,
  LeaveStatus,
  Role,
} from "@/app/generated/prisma/client";

/* ----------------------------------------
   EMPLOYEE LIST
---------------------------------------- */

export const getAllEmployees = async () => {
  return await prisma.user.findMany({
    where: { role: Role.EMPLOYEE },
    include: {
      profile: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/* ----------------------------------------
   ATTENDANCE RECORDS (ALL EMPLOYEES)
---------------------------------------- */

export const getAllAttendanceRecords = async (options?: {
  from?: Date;
  to?: Date;
}) => {
  return await prisma.attendance.findMany({
    where: {
      ...(options?.from || options?.to
        ? {
            date: {
              ...(options.from ? { gte: options.from } : {}),
              ...(options.to ? { lte: options.to } : {}),
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
};

/* ----------------------------------------
   LEAVE APPROVAL LIST
---------------------------------------- */

export const getAllLeaveRequests = async () => {
  return await prisma.leave.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { from: "desc" },
  });
};

/* ----------------------------------------
   APPROVE / REJECT LEAVE
---------------------------------------- */

export const updateLeaveStatus = async (data: {
  leaveId: string;
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;
}) => {
  return await prisma.leave.update({
    where: { id: data.leaveId },
    data: {
      status: data.status,
    },
  });
};
