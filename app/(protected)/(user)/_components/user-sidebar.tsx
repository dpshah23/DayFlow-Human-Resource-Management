// File: components/layouts/user-sidebar.tsx
"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { User, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
}

const navItems = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky space-y-4 top-20">
      {/* User Info Card */}
      <Card className="p-6 bg-content2">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Avatar
            showFallback
            className="w-20 h-20"
            src={user.image || undefined}
          />
          <div>
            <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-foreground/60">{user.email}</p>
          </div>
          <Chip
            color={user.role === "ADMIN" ? "danger" : "primary"}
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-4 bg-content2">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  className={`w-full justify-start ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-content3"
                  }`}
                  startContent={<Icon size={18} />}
                  variant={active ? "solid" : "light"}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </Card>
    </div>
  );
}
