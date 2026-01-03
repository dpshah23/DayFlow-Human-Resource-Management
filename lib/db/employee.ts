"use server";

import prisma from "../prisma";
import {
  AttendanceStatus,
  LeaveStatus,
  LeaveType,
} from "@/app/generated/prisma/client";

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

export const getEmployeeAttendance = async (userId: string, options?: {
  from?: Date;
  to?: Date;
}) => {
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
