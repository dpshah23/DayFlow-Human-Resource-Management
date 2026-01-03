"use server";

import prisma from "../prisma";

import { Prisma, User } from "@/app/generated/prisma/client";

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const findUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role || null;
};

type UpdateUserData = Omit<
  Prisma.UserUpdateInput,
  "id" | "createdAt" | "updatedAt"
>;
export const updateUser = async (id: string, data: UpdateUserData) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return user;
};

export async function findAllUsers(options?: {
  where?: Prisma.UserWhereInput;
  select?: Prisma.UserSelect;
}) {
  if (options?.where) {
    if (options?.select) {
      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        where: options.where,
        select: options.select,
      });
    }

    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: options.where,
    });
  }

  if (options?.select) {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: options?.select,
    });
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findUsersWithFilters(filters: {
  role?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ users: User[]; total: number }> {
  try {
    // Replace with your actual database query with filters
    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: filters.limit || 10,
        skip: filters.offset || 0,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.error("Failed to fetch filtered users:", error);
    throw new Error("Failed to fetch filtered users");
  }
}

export async function createUser(data: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export const deleteUser = async (id: string) => {
  const { id: userId } = await prisma.user.delete({
    where: { id },
  });

  return userId;
};

export const bulkDeleteUsers = async (ids: string[]) => {
  const resp = await prisma.user.deleteMany({
    where: {
      id: { in: ids.map((id) => id.toString()) },
    },
  });

  return ids.length === resp.count ? ids : [];
};
