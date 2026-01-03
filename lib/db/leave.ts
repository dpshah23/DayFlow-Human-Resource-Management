"use server";

import prisma from "../prisma";
import {
  LeaveStatus,
  LeaveType,
} from "@/app/generated/prisma/client";

/* ----------------------------------------
   APPLY FOR LEAVE (EMPLOYEE)
---------------------------------------- */

export const applyForLeave = async (data: {
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
   VIEW OWN LEAVES
---------------------------------------- */

export const getLeavesByUser = async (userId: string) => {
  return await prisma.leave.findMany({
    where: { userId },
    orderBy: { from: "desc" },
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
    orderBy: { from: "desc" },
  });
};
