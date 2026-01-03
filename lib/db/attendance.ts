"use server";

import prisma from "../prisma";
import { AttendanceStatus } from "@/app/generated/prisma/client";

/* ----------------------------------------
   CHECK-IN / CHECK-OUT
---------------------------------------- */

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
