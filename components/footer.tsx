// File: components\footer.tsx
import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Mail, Phone, MapPin } from "lucide-react";

import StaggeredFadeInList from "./ui/animations/staggered-fade-in-list";

const Footer = () => {
  return (
    <footer className="border-t bg-content2 border-divider">
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <StaggeredFadeInList>
            {/* Company Info Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="mb-4 text-xl font-bold text-primary font-heading sm:text-2xl">
                Dayflow
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-foreground/60 sm:text-base">
                Streamline your HR operations with our comprehensive management
                system. From onboarding to payroll, we&apos;ve got every workday
                perfectly aligned.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="flex-shrink-0 w-4 h-4 mt-1 text-primary" />
                  <div className="text-sm text-foreground/60">
                    <p>Corporate Office</p>
                    <p>Business District, City - 100001</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="flex-shrink-0 w-4 h-4 text-primary" />
                  <Link
                    isExternal
                    className="text-sm transition-colors text-foreground/60 hover:text-primary"
                    href="tel:+911234567890"
                  >
                    +91 12345 67890
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="flex-shrink-0 w-4 h-4 text-primary" />
                  <Link
                    isExternal
                    className="text-sm break-all transition-colors text-foreground/60 hover:text-primary"
                    href="mailto:support@dayflow.com"
                  >
                    support@dayflow.com
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground font-heading">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Features", url: "/features" },
                  { name: "About Us", url: "/about-us" },
                  { name: "Resources", url: "/resources" },
                  { name: "Contact", url: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      className="block py-1 text-sm transition-colors text-foreground/60 hover:text-primary"
                      href={item.url}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup Section */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-foreground font-heading">
                Stay Updated
              </h3>
              <p className="text-sm text-foreground/60">
                Get the latest HR insights and product updates delivered to your
                inbox.
              </p>

              <div className="flex flex-col gap-3">
                <Input
                  className="w-full"
                  classNames={{
                    input: "text-foreground",
                    inputWrapper:
                      "border-default hover:border-primary focus-within:border-primary",
                  }}
                  placeholder="Enter your email"
                  size="sm"
                  type="email"
                  variant="bordered"
                />
                <Button
                  className="w-full text-primary-foreground"
                  color="primary"
                  size="sm"
                  variant="solid"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </StaggeredFadeInList>
        </div>

        <Divider className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-foreground/60">
            <p>&copy; 2025 Dayflow. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              className="text-sm transition-colors text-foreground/60 hover:text-primary"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm transition-colors text-foreground/60 hover:text-primary"
              href="/terms-of-service"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
