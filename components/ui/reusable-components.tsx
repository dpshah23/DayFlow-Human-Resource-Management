// File: components\ui\reusable-components.tsx
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";

import { CountUp } from "./animations/count-up";
import StaggeredFadeInList from "./animations/staggered-fade-in-list";

// Page Title Component
type PageTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  subtitleClassName?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
};

export const PageTitle = ({
  title,
  subtitle,
  className = "",
  subtitleClassName = "",
  centered = false,
  size = "lg",
}: PageTitleProps) => {
  const sizeClasses = {
    sm: "text-xl sm:text-2xl md:text-3xl",
    md: "text-2xl sm:text-3xl md:text-4xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <div
      className={`mb-6 lg:mb-8 ${centered ? "text-center" : ""} ${className}`}
    >
      <h1
        className={`mb-3 font-bold text-foreground font-heading ${sizeClasses[size]}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`max-w-3xl mx-auto text-base leading-relaxed text-foreground/60 sm:text-lg md:text-xl ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Section Component
export type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "content1" | "content2" | "content3" | "content4";
  padding?: "none" | "small" | "default" | "large";
  [key: string]: any;
  clearTop?: boolean;
};

export const Section = ({
  children,
  className = "",
  containerClassName = "",
  background = "default",
  padding = "default",
  clearTop = false,
  ...props
}: SectionProps) => {
  const bgClasses = {
    default: "bg-background",
    content1: "bg-content1",
    content2: "bg-content2",
    content3: "bg-content3",
    content4: "bg-content4",
  };

  const paddingClasses = {
    none: "",
    small: "py-6 sm:py-8 lg:py-12",
    default: "py-8 sm:py-12 lg:py-16",
    large: "py-12 sm:py-16 lg:py-24",
  };

  const clearTopPaddingClass = clearTop ? "py-0 sm:py-0 lg:py-0" : "";

  return (
    <section
      {...props}
      className={`${bgClasses[background]} ${paddingClasses[padding]} ${clearTopPaddingClass} ${className}`}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
};

// Section Title Component
export type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  size?: "small" | "default" | "large";
  centered?: boolean;
};

export const SectionTitle = ({
  title,
  subtitle,
  className = "",
  size = "default",
  centered = true,
}: SectionTitleProps) => {
  const sizeClasses = {
    small: "text-xl sm:text-2xl md:text-3xl",
    default: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <div
      className={`mb-6 lg:mb-8 ${centered ? "text-center" : ""} ${className}`}
    >
      <h2
        className={`font-heading ${sizeClasses[size]} font-bold text-foreground mb-3`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-foreground/60">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Content Card Component
export type ContentCardProps = {
  children: React.ReactNode;
  className?: string;
  shadow?: "sm" | "md" | "lg" | "none";
  padding?: "small" | "default" | "large";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isPressable?: boolean;
};

export const ContentCard = ({
  children,
  className = "",
  shadow = "sm",
  padding = "default",
  header,
  footer,
  isPressable = false,
}: ContentCardProps) => {
  const paddingClasses = {
    small: "p-3 sm:p-4 lg:p-6",
    default: "p-4 sm:p-6 lg:p-8",
    large: "p-6 sm:p-8 lg:p-12",
  };

  return (
    <Card
      className={`bg-content2 h-full ${className}`}
      isPressable={isPressable}
      shadow={shadow}
    >
      {header && <CardHeader className="pb-0">{header}</CardHeader>}
      <CardBody
        className={`${paddingClasses[padding]} ${header ? "pt-4" : ""}`}
      >
        {children}
      </CardBody>
      {footer && (
        <>
          <Divider />
          <CardBody className="pt-4">{footer}</CardBody>
        </>
      )}
    </Card>
  );
};

// Text Block Component
export type TextBlockProps = {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "default" | "large";
};

export const TextBlock = ({
  children,
  className = "",
  size = "default",
}: TextBlockProps) => {
  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} text-foreground/60 leading-relaxed space-y-3 sm:space-y-4 ${className}`}
    >
      {children}
    </div>
  );
};

// List Component
export type ListProps = {
  items: React.ReactNode[];
  ordered?: boolean;
  className?: string;
  spacing?: "tight" | "default" | "loose";
};

export const List = ({
  items,
  ordered = false,
  className = "",
  spacing = "default",
}: ListProps) => {
  const spacingClasses = {
    tight: "space-y-1 sm:space-y-2",
    default: "space-y-2 sm:space-y-3",
    loose: "space-y-3 sm:space-y-4",
  };

  const ListTag = ordered ? "ol" : "ul";
  const listStyle = ordered ? "list-decimal" : "list-disc";

  return (
    <ListTag
      className={`${listStyle} list-inside ${spacingClasses[spacing]} text-foreground/60 ${className}`}
    >
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  );
};

// Highlight Box Component
export type HighlightBoxProps = {
  children: React.ReactNode;
  type?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  variant?: "flat" | "bordered" | "light";
};

export const HighlightBox = ({
  children,
  type = "default",
  className = "",
  variant = "flat",
}: HighlightBoxProps) => {
  return (
    <div className={`p-4 sm:p-6 rounded-lg ${className}`}>
      <Chip className="mb-3" color={type as any} size="sm" variant={variant}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Chip>
      <div className="text-foreground/60">{children}</div>
    </div>
  );
};

export type StatCardProps = {
  title: string;
  value: string | number | React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;

  // NEW
  suffix?: string;
  prefix?: string;
  commas?: "ind" | "int";
  decimals?: number;
};

export const StatCard = ({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  className = "",
  suffix,
  prefix,
  commas,
  decimals = 0,
}: StatCardProps) => {
  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-foreground/60",
  };

  const isNumericValue =
    (typeof value === "string" && !isNaN(Number(value))) ||
    typeof value === "number";

  return (
    <Card className={`bg-content2 ${className}`} shadow="sm">
      <CardBody className="p-4 overflow-hidden sm:p-6">
        <div className="flex items-start justify-between">
          <StaggeredFadeInList>
            <div className="flex-1">
              <StaggeredFadeInList>
                <p className="mb-1 text-sm font-medium text-foreground/60">
                  {title}
                </p>
                <h3 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">
                  {isNumericValue ? (
                    <CountUp
                      commas={commas}
                      decimals={decimals}
                      prefix={prefix}
                      suffix={suffix}
                      to={Number(value)}
                    />
                  ) : (
                    value
                  )}
                </h3>
                <div className="min-h-[1.25rem]">
                  {change && (
                    <p className={`text-sm font-medium ${trendColors[trend]}`}>
                      {change}
                    </p>
                  )}
                </div>
              </StaggeredFadeInList>
            </div>
            {icon && (
              <div className="p-2 rounded-lg sm:p-3 bg-primary/10">{icon}</div>
            )}
          </StaggeredFadeInList>
        </div>
      </CardBody>
    </Card>
  );
};

// Page Layout Component
export type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl" | "full";
  padding?: "none" | "default";
};

export const PageLayout = ({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "default",
}: PageLayoutProps) => {
  const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "w-full",
  };

  const paddingClasses = {
    none: "p-0",
    default: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12",
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div
        className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]}`}
      >
        {children}
      </div>
    </div>
  );
};
