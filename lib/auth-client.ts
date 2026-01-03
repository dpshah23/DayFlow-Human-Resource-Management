import type { auth } from "@/lib/auth"; // Import the auth instance as a type

import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [customSessionClient<typeof auth>()],
});
