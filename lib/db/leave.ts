"use server";

import prisma from "../prisma";

import { LeaveStatus, LeaveType, Prisma } from "@/app/generated/prisma/client";

/* ----------------------------------------
   APPLY FOR LEAVE (EMPLOYEE)
---------------------------------------- */

export const applyForLeave = async (data: {
  userId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}) => {
  return await prisma.leave.create({
    data: {
      userId: data.userId,
      leaveType: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      // endDate: data.endDate

      reason: data.reason,
      status: LeaveStatus.PENDING,
    },
  });
};

/* ----------------------------------------
   VIEW OWN LEAVES
---------------------------------------- */

export const getLeavesByUser = async (userId: string) => {
  return await prisma.leave.findMany({
    where: { userId },
    orderBy: { startDate: "desc" },
  });
};

/* ----------------------------------------
   ADMIN VIEW ALL LEAVES
---------------------------------------- */

export const getAllLeavesForAdmin = async () => {
  return await prisma.leave.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { startDate: "desc" },
  });
};

export const findLeaveById = async (id: string) => {
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return leave;
};

export const findLeavesByUserId = async (userId: string) => {
  const leaves = await prisma.leave.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return leaves;
};

export const findAllLeaves = async () => {
  const leaves = await prisma.leave.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return leaves;
};

export type UpdateLeaveData = {
  startDate?: Date;
  endDate?: Date;
  leaveType?: LeaveType;
  reason?: string;
  status?: LeaveStatus;
};

export const updateLeave = async (id: string, data: UpdateLeaveData) => {
  const leave = await prisma.leave.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return leave;
};

export async function createLeave(data: Prisma.LeaveUncheckedCreateInput) {
  const leave = await prisma.leave.create({
    data: {
      ...data,
      status: "PENDING", // Always set to PENDING on creation
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return leave;
}

export const deleteLeave = async (id: string) => {
  const { id: leaveId } = await prisma.leave.delete({
    where: { id },
  });

  return leaveId;
};

// Get leave statistics for a user
export const getUserLeaveStats = async (userId: string, year?: number) => {
  const currentYear = year || new Date().getFullYear();

  const leaves = await prisma.leave.findMany({
    where: {
      userId,
      startDate: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
    totalDays: leaves
      .filter((l) => l.status === "APPROVED")
      .reduce((acc, leave) => {
        const days =
          Math.ceil(
            (leave.endDate.getTime() - leave.startDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1;

        return acc + days;
      }, 0),
  };

  return stats;
};
