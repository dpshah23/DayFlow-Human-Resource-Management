import { Role } from "@/app/generated/prisma";
import { authClient } from "@/lib/auth-client";

export const useUser = () => {
  const { data, isPending, refetch } = authClient.useSession();

  const user = data?.user
    ? {
        ...data.user,
        isAdmin: data.user.role === Role.ADMIN,
        isStaff: data.user.role === Role.STAFF,
      }
    : null;

  return {
    isProfileComplete: data?.isProfileComplete || false,
    session: data?.session || null,
    user, // fully typed or completely null
    isPending,
    refetch,
    isAuthenticated: !!user,
  };
};
