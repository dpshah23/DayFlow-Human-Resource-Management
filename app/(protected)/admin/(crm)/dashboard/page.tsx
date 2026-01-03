"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Plus,
  ClipboardCheck,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Tabs, Tab } from "@heroui/tabs";

import { useLayoutContext } from "../_context/layout-context";
import { PageLoader } from "../_components/loading-spinner";
import {
  attendanceTrendData7Days,
  attendanceTrendData30Days,
} from "../analytics/page";

import StaggeredFadeInList from "@/components/ui/animations/staggered-fade-in-list";

const DashboardPage = () => {
  const { setBreadcrumbs, setActiveMenuItem, isLoading, setIsLoading } =
    useLayoutContext();
  const { theme } = useTheme();
  const [attendanceTimeRange, setAttendanceTimeRange] = useState("7days");

  const stats = [
    {
      label: "Total Employees",
      value: "247",
      change: "+5",
      trend: "up",
      icon: <Users />,
      color: "bg-primary-500/20",
    },
    {
      label: "Present Today",
      value: "239",
      change: "+2%",
      trend: "up",
      icon: <UserCheck />,
      color: "bg-success-500/20",
    },
    {
      label: "Attendance Rate",
      value: "96.8%",
      change: "+2.3%",
      trend: "up",
      icon: <Activity />,
      color: "bg-secondary-500/10",
    },
    {
      label: "Pending Leaves",
      value: "12",
      change: "-3",
      trend: "down",
      icon: <Calendar />,
      color: "bg-warning-500/10",
    },
  ];

  const activities = [
    {
      title: "Leave Request",
      subtitle: "Sarah Johnson - Sick Leave",
      time: "5 minutes ago",
      type: "leave",
      avatar: "SJ",
      status: "pending",
    },
    {
      title: "New Employee",
      subtitle: "Michael Chen - Engineering",
      time: "1 hour ago",
      type: "employee",
      avatar: "MC",
      status: "success",
    },
    {
      title: "Attendance Alert",
      subtitle: "3 employees not checked in",
      time: "2 hours ago",
      type: "alert",
      avatar: "AA",
      status: "warning",
    },
    {
      title: "Payroll Processed",
      subtitle: "December 2024 - 247 employees",
      time: "3 hours ago",
      type: "payroll",
      avatar: "PP",
      status: "success",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "Add New Employee", color: "primary" },
    { icon: ClipboardCheck, label: "Mark Attendance", color: "success" },
    { icon: Calendar, label: "Review Leave Requests", color: "warning" },
    { icon: BarChart3, label: "Generate Report", color: "secondary" },
  ];

  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setBreadcrumbs([
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Overview" },
      ]);
      setActiveMenuItem("dashboard");
      setIsLoading(false);
    }, 500);
  }, [setBreadcrumbs, setActiveMenuItem, setIsLoading]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StaggeredFadeInList>
          {stats.map((stat, index) => {
            const trendColor =
              stat.trend === "up" ? "text-success" : "text-danger";
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

            return (
              <Card
                key={index}
                className="transition-shadow duration-200 bg-content1 hover:shadow-md"
                shadow="sm"
              >
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-sm font-medium truncate text-foreground/60">
                        {stat.label}
                      </p>
                      <h3 className="mb-2 text-2xl font-bold sm:text-3xl text-foreground">
                        {stat.value}
                      </h3>
                      <div className="flex items-center gap-1">
                        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        <span className={`text-sm font-medium ${trendColor}`}>
                          {stat.change}
                        </span>
                        <span className="ml-1 text-xs text-foreground/50">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg sm:p-3 ${stat.color} `}>
                      {stat.icon}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </StaggeredFadeInList>
      </div>

      {/* Chart and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Chart Section */}
        <Card className="bg-content1 lg:col-span-2" shadow="sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold sm:text-xl text-foreground">
                  Daily Attendance Trend
                </h3>
                <p className="mt-1 text-sm text-foreground/60">
                  Attendance status breakdown over time
                </p>
              </div>
              <Tabs
                color="primary"
                selectedKey={attendanceTimeRange}
                size="sm"
                variant="solid"
                onSelectionChange={(key) =>
                  setAttendanceTimeRange(key as string)
                }
              >
                <Tab key="7days" title="Last 7 Days" />
                <Tab key="30days" title="Last Month" />
              </Tabs>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer height={350} width="100%">
              <AreaChart
                data={
                  attendanceTimeRange === "7days"
                    ? attendanceTrendData7Days
                    : attendanceTrendData30Days
                }
              >
                <defs>
                  <linearGradient id="colorPresent" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#17C964" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#17C964" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#F31260" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F31260" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid opacity={0.1} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                />
                <YAxis
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      theme === "dark"
                        ? "hsl(var(--nextui-content1))"
                        : "white",
                    border: "1px solid hsl(var(--nextui-divider))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  dataKey="present"
                  fill="url(#colorPresent)"
                  fillOpacity={1}
                  name="Present"
                  stroke="#17C964"
                  type="monotone"
                />
                <Area
                  dataKey="absent"
                  fill="url(#colorAbsent)"
                  fillOpacity={1}
                  name="Absent"
                  stroke="#F31260"
                  type="monotone"
                />
                <Area
                  dataKey="halfDay"
                  fill="#F5A524"
                  fillOpacity={0.2}
                  name="Half Day"
                  stroke="#F5A524"
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-foreground">
                Recent Activity
              </h3>
              <Button color="primary" size="sm" variant="light">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar
                  className={`${activity.status === "pending"
                      ? "bg-warning text-warning-foreground"
                      : activity.status === "success"
                        ? "bg-success text-success-foreground"
                        : "bg-danger text-danger-foreground"
                    }`}
                  name={activity.avatar}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm truncate text-foreground/60">
                    {activity.subtitle}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}

            <Divider className="my-4" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Quick Actions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <Button
                      key={index}
                      className="justify-start h-auto p-3"
                      startContent={<Icon className="w-4 h-4" />}
                      variant="light"
                    >
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {/* Pending Leave Requests */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-foreground">
                Leave Requests
              </h3>
              <Chip color="warning" size="sm" variant="flat">
                12 Pending
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              {
                name: "Sarah Johnson",
                type: "Sick Leave",
                dates: "Jan 5-7, 2025",
                status: "Pending",
              },
              {
                name: "Michael Chen",
                type: "Paid Leave",
                dates: "Jan 10-12, 2025",
                status: "Pending",
              },
              {
                name: "Emily Davis",
                type: "Unpaid Leave",
                dates: "Jan 15, 2025",
                status: "Approved",
              },
            ].map((leave, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {leave.name}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {leave.type} • {leave.dates}
                  </p>
                </div>
                <Chip
                  color={leave.status === "Approved" ? "success" : "warning"}
                  size="sm"
                  variant="flat"
                >
                  {leave.status}
                </Chip>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Upcoming Events
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              {
                event: "Team Building Activity",
                time: "Jan 8, 2025 • 10:00 AM",
                type: "event",
              },
              {
                event: "Performance Reviews",
                time: "Jan 15, 2025 • All Day",
                type: "review",
              },
              {
                event: "New Employee Orientation",
                time: "Jan 20, 2025 • 9:00 AM",
                type: "orientation",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {item.event}
                  </p>
                  <p className="text-xs text-foreground/60">{item.time}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Department Summary */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Department Overview
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Engineering</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">89</span>
                <Chip color="success" size="sm" variant="flat">
                  98%
                </Chip>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Sales</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">45</span>
                <Chip color="success" size="sm" variant="flat">
                  95%
                </Chip>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Marketing</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">32</span>
                <Chip color="warning" size="sm" variant="flat">
                  92%
                </Chip>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">HR & Admin</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">18</span>
                <Chip color="success" size="sm" variant="flat">
                  100%
                </Chip>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Overall Attendance
              </span>
              <Chip color="success" size="sm" variant="flat">
                96.8%
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="bg-content1" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-bold text-foreground">
              Attention Required
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Late Check-ins
                </p>
                <p className="text-xs text-foreground/60">3 employees today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-danger/10">
              <AlertCircle className="w-5 h-5 text-danger" />
              <div>
                <p className="text-sm font-medium text-foreground">Absent</p>
                <p className="text-xs text-foreground/60">
                  5 without notification
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Leave Quota
                </p>
                <p className="text-xs text-foreground/60">
                  12 employees low balance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
              <UserCheck className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Perfect Attendance
                </p>
                <p className="text-xs text-foreground/60">
                  89 employees this month
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardPage;
