"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User, LogOut, Settings, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hooks/useUser";

export const AuthButtons = ({
  orientation = "horizontal",
}: {
  orientation?: "vertical" | "horizontal";
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const { isPending, user } = useUser();

  const className =
    orientation === "vertical"
      ? "flex flex-col items-start gap-3 w-full"
      : "flex items-center gap-3";

  const handleAction = async (action: "profile" | "settings" | "logout") => {
    switch (action) {
      case "profile":
        router.push("/profile");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "logout":
        await authClient.signOut();
        router.push("/sign-in?redirectTo=" + encodeURIComponent(pathName));

        break;
    }
  };

  if (isPending) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center p-2">
          <Spinner className="animate-spin" color="primary" size="sm" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <Button
          as={Link}
          className="font-semibold"
          color="primary"
          endContent={<ArrowRight className="w-4 h-4" />}
          href={`/sign-up?redirectTo=${encodeURIComponent(pathName)}`}
          variant="solid"
        >
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <Dropdown className="mr-2" placement="bottom-end">
        <DropdownTrigger>
          {/* <Button isIconOnly className="p-0" variant="flat"> */}
          <Avatar
            showFallback
            className="transition-all duration-200 ring-2 ring-primary/20 hover:ring-primary/40 cursor-pointer"
            name={user.name || user.email || "User"}
            size="sm"
            src={user.image || undefined}
          />
          {/* </Button> */}
        </DropdownTrigger>

        <DropdownMenu
          aria-label="User actions"
          variant="flat"
          onAction={(key) => handleAction(key as any)}
        >
          <DropdownItem key="message" isReadOnly>
            Signed in as <br /> <strong>{user.email}</strong>
          </DropdownItem>
          <DropdownItem
            key="profile"
            startContent={<User className="w-4 h-4" />}
          >
            Profile
          </DropdownItem>

          <DropdownItem
            key="settings"
            startContent={<Settings className="w-4 h-4" />}
          >
            Settings
          </DropdownItem>

          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            startContent={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
