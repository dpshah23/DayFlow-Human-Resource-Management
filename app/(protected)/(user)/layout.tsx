"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { UserSidebar } from "./_components/user-sidebar";

import { Navbar } from "@/components/navbar";
import { useUser } from "@/hooks/useUser";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user: currentUser, session, isPending } = useUser();

  // 🔒 Handle unauthenticated redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  // ⏳ Show spinner only while checking auth or loading profile
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated and not pending, don’t render layout (redirect in progress)
  if (!session || !currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <Button
              isIconOnly
              variant="flat"
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 ${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            <UserSidebar user={currentUser} />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="h-full space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
