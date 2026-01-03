import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LayoutContextProvider } from "./(crm)/_context/layout-context";

import { auth } from "@/lib/auth";
import { DEFAULT_REDIRECT_URL } from "@/lib/route";
import { Role } from "@/app/generated/prisma";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session ||
    !session.user ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.EMPLOYEE)
  ) {
    redirect(DEFAULT_REDIRECT_URL);
  }

  return <LayoutContextProvider>{children}</LayoutContextProvider>;
};

export default AdminLayout;
