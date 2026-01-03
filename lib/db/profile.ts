"use server";

import prisma from "../prisma";

/* ----------------------------------------
   VIEW PROFILE
---------------------------------------- */

export const getProfileByUserId = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};

/* ----------------------------------------
   EMPLOYEE EDIT (LIMITED FIELDS)
---------------------------------------- */

export const updateOwnProfile = async (
  userId: string,
  data: {
    phone?: string;
    address?: string;
    image?: string;
  }
) => {
  return await prisma.profile.update({
    where: { userId },
    data,
  });
};

/* ----------------------------------------
   ADMIN EDIT (FULL CONTROL)
---------------------------------------- */

export const adminUpdateProfile = async (
  profileId: string,
  data: {
    name?: string;
    phone?: string;
    address?: string;
    salary?: number;
  }
) => {
  return await prisma.profile.update({
    where: { id: profileId },
    data,
  });
};
