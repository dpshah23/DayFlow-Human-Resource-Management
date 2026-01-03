"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { AuthButtons } from "./auth-buttons";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = ({
  position = "sticky",
}: {
  position?: "static" | "sticky";
}) => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (href: string) => path === href;

  return (
    <HeroUINavbar
      className="border-b shadow-xs backdrop-blur-md bg-background/80 border-content2"
      height="64px"
      isMenuOpen={isMenuOpen}
      maxWidth="2xl"
      position={position}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-2" href="/">
            {/* Modern Logo with Gradient Background */}
            <div className="flex items-center justify-center w-8 h-8 transition-transform rounded-lg bg-gradient-to-r from-primary to-secondary hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {siteConfig.name.includes("MAX") ? (
                <>
                  {siteConfig.name.replace("MAX", "")}
                  <span className="text-primary">MAX</span>
                </>
              ) : (
                siteConfig.name
              )}
            </span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center Navigation - Desktop */}

      {/* Right Side - Desktop */}
      <NavbarContent
        className="hidden lg:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <AuthButtons />
        </NavbarItem>
        {/* CTA Button */}
        {/* <NavbarItem className="hidden lg:flex">
          <Button
            as={NextLink}
            className="font-semibold"
            color="primary"
            endContent={<ArrowRight className="w-4 h-4" />}
            href="/contact"
            size="sm"
            variant="solid"
          >
            Get Started
          </Button>
        </NavbarItem> */}
      </NavbarContent>

      {/* Mobile Navigation Toggle */}
      <NavbarContent className="pl-4 lg:hidden basis-1" justify="end">
        <ThemeSwitch />
        <NavbarItem className="hidden sm:flex lg:hidden">
          <AuthButtons />
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="transition-colors text-foreground hover:text-primary"
        />
      </NavbarContent>

      {/* Mobile Menu */}
    </HeroUINavbar>
  );
};
