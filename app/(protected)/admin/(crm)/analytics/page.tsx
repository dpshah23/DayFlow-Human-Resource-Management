"use client";

import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTheme } from "next-themes";

import { useLayoutContext } from "../_context/layout-context";
import { PageLoader } from "../_components/loading-spinner";

import StaggeredFadeInList from "@/components/ui/animations/staggered-fade-in-list";
// Dummy data based on Prisma schema
export const attendanceTrendData7Days = [
  { date: "Dec 27", present: 240, absent: 4, halfDay: 2, leave: 1 },
  { date: "Dec 28", present: 236, absent: 7, halfDay: 3, leave: 1 },
  { date: "Dec 29", present: 234, absent: 9, halfDay: 3, leave: 1 },
  { date: "Dec 30", present: 239, absent: 5, halfDay: 2, leave: 1 },
  { date: "Dec 31", present: 232, absent: 10, halfDay: 4, leave: 1 },
  { date: "Jan 01", present: 230, absent: 12, halfDay: 4, leave: 1 },
  { date: "Jan 02", present: 238, absent: 6, halfDay: 2, leave: 1 },
];

export const attendanceTrendData30Days = [
  { date: "Dec 4", present: 238, absent: 6, halfDay: 2, leave: 1 },
  { date: "Dec 5", present: 240, absent: 4, halfDay: 2, leave: 1 },
  { date: "Dec 6", present: 235, absent: 8, halfDay: 3, leave: 1 },
  { date: "Dec 9", present: 239, absent: 5, halfDay: 2, leave: 1 },
  { date: "Dec 10", present: 241, absent: 3, halfDay: 2, leave: 1 },
  { date: "Dec 11", present: 237, absent: 7, halfDay: 2, leave: 1 },
  { date: "Dec 12", present: 240, absent: 4, halfDay: 2, leave: 1 },
  { date: "Dec 13", present: 236, absent: 8, halfDay: 2, leave: 1 },
  { date: "Dec 16", present: 239, absent: 5, halfDay: 2, leave: 1 },
  { date: "Dec 17", present: 242, absent: 2, halfDay: 2, leave: 1 },
  { date: "Dec 18", present: 238, absent: 6, halfDay: 2, leave: 1 },
  { date: "Dec 19", present: 235, absent: 9, halfDay: 2, leave: 1 },
  { date: "Dec 20", present: 240, absent: 4, halfDay: 2, leave: 1 },
  { date: "Dec 23", present: 234, absent: 10, halfDay: 2, leave: 1 },
  { date: "Dec 24", present: 228, absent: 15, halfDay: 3, leave: 1 },
  { date: "Dec 25", present: 220, absent: 22, halfDay: 4, leave: 1 },
  { date: "Dec 26", present: 238, absent: 6, halfDay: 2, leave: 1 },
  { date: "Dec 27", present: 240, absent: 4, halfDay: 2, leave: 1 },
  { date: "Dec 30", present: 239, absent: 5, halfDay: 2, leave: 1 },
  { date: "Dec 31", present: 232, absent: 10, halfDay: 4, leave: 1 },
  { date: "Jan 1", present: 230, absent: 12, halfDay: 4, leave: 1 },
  { date: "Jan 2", present: 238, absent: 6, halfDay: 2, leave: 1 },
];

const AnalyticsPage = () => {
  const { setBreadcrumbs, setActiveMenuItem, isLoading, setIsLoading } =
    useLayoutContext();
  const { theme } = useTheme();

  const [attendanceTimeRange, setAttendanceTimeRange] = React.useState("7days");

  const leaveTypeData = [
    { name: "Paid Leave", value: 45, color: "#006FEE" },
    { name: "Sick Leave", value: 28, color: "#17C964" },
    { name: "Unpaid Leave", value: 12, color: "#F5A524" },
  ];

  const leaveStatusData = [
    { status: "Pending", count: 12 },
    { status: "Approved", count: 58 },
    { status: "Rejected", count: 5 },
  ];

  const departmentAttendanceData = [
    { department: "Engineering", present: 86, absent: 3, rate: 96.6 },
    { department: "Sales", present: 43, absent: 2, rate: 95.6 },
    { department: "Marketing", present: 30, absent: 2, rate: 93.8 },
    { department: "HR & Admin", present: 18, absent: 0, rate: 100 },
    { department: "Finance", present: 24, absent: 1, rate: 96.0 },
  ];

  const monthlyTrendData = [
    { month: "Jul", attendance: 94.2, leaves: 18 },
    { month: "Aug", attendance: 95.1, leaves: 22 },
    { month: "Sep", attendance: 96.3, leaves: 15 },
    { month: "Oct", attendance: 95.8, leaves: 20 },
    { month: "Nov", attendance: 96.5, leaves: 17 },
    { month: "Dec", attendance: 96.8, leaves: 19 },
  ];

  const stats = [
    {
      label: "Avg Attendance Rate",
      value: "96.8%",
      change: "+2.3%",
      icon: <Activity />,
      color: "bg-success-500/20",
    },
    {
      label: "Total Leaves (Dec)",
      value: "85",
      change: "+12%",
      icon: <Calendar />,
      color: "bg-warning-500/20",
    },
    {
      label: "Active Employees",
      value: "247",
      change: "+5",
      icon: <Users />,
      color: "bg-primary-500/20",
    },
    {
      label: "Leave Approval Rate",
      value: "92%",
      change: "+5%",
      icon: <ClipboardCheck />,
      color: "bg-secondary-500/20",
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setBreadcrumbs([
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Analytics" },
      ]);
      setActiveMenuItem("analytics");
      setIsLoading(false);
    }, 500);
  }, [setBreadcrumbs, setActiveMenuItem, setIsLoading]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl">
      {/* Dummy Data Notice */}
      <Card className="border-warning bg-warning/5" shadow="sm">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Dummy Data Notice
              </p>
              <p className="text-sm text-foreground/60">
                This analytics dashboard currently displays dummy/mock data for
                demonstration purposes. Real data will be populated once
                connected to the database.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StaggeredFadeInList>
          {stats.map((stat, index) => (
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
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">
                        {stat.change}
                      </span>
                      <span className="ml-1 text-xs text-foreground/50">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg sm:p-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </StaggeredFadeInList>
      </div>

      {/* Attendance Trend */}
      <Card className="bg-content1" shadow="sm">
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
              onSelectionChange={(key) => setAttendanceTimeRange(key as string)}
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
                    theme === "dark" ? "hsl(var(--nextui-content1))" : "white",
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

      {/* Department Performance & Leave Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Attendance */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Department Attendance Rate
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                Current month performance by department
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer height={300} width="100%">
              <BarChart data={departmentAttendanceData} layout="vertical">
                <CartesianGrid opacity={0.1} strokeDasharray="3 3" />
                <XAxis domain={[0, 100]} type="number" />
                <YAxis
                  dataKey="department"
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                  type="category"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--nextui-content1))",
                    border: "1px solid hsl(var(--nextui-divider))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rate" fill="#006FEE" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Leave Type Distribution */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Leave Type Distribution
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                Breakdown of leave types (December 2024)
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer height={300} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={leaveTypeData}
                  dataKey="value"
                  fill="#8884d8"
                  label={({ name, percent }) => {
                    return percent
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : "";
                  }}
                  labelLine={false}
                  outerRadius={100}
                >
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--nextui-content1))",
                    border: "1px solid hsl(var(--nextui-divider))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Monthly Trends & Leave Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Attendance & Leave Trend */}
        <Card className="bg-content1 lg:col-span-2" shadow="sm">
          <CardHeader className="pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                6-Month Attendance & Leave Trend
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                Historical attendance rate and leave count
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer height={300} width="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid opacity={0.1} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                />
                <YAxis
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                  yAxisId="left"
                />
                <YAxis
                  orientation="right"
                  tick={{ fill: theme === "dark" ? "#888888" : "#444444" }}
                  yAxisId="right"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--nextui-content1))",
                    border: "1px solid hsl(var(--nextui-divider))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  dataKey="attendance"
                  dot={{ fill: "#006FEE", r: 4 }}
                  name="Attendance Rate (%)"
                  stroke="#006FEE"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="left"
                />
                <Line
                  dataKey="leaves"
                  dot={{ fill: "#F5A524", r: 4 }}
                  name="Leave Count"
                  stroke="#F5A524"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Leave Status Summary */}
        <Card className="bg-content1" shadow="sm">
          <CardHeader className="pb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Leave Request Status
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                Current month breakdown
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {leaveStatusData.map((item, index) => {
              const colors = {
                Pending: "bg-warning",
                Approved: "bg-success",
                Rejected: "bg-danger",
              };
              const color =
                colors[item.status as keyof typeof colors] || "bg-default";

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-sm font-medium text-foreground">
                        {item.status}
                      </span>
                    </div>
                    <Chip color="default" size="sm" variant="flat">
                      {item.count}
                    </Chip>
                  </div>
                  <div className="w-full h-2 rounded-full bg-content2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{
                        width: `${(item.count / 75) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 mt-4 border-t border-divider">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total Requests
                </span>
                <span className="text-lg font-bold text-foreground">75</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Insights Summary */}
      <Card className="bg-content1" shadow="sm">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-bold text-foreground">Key Insights</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Attendance Improving
                  </p>
                  <p className="text-xs text-foreground/60">
                    +2.3% increase in attendance rate compared to last month
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    HR & Admin Perfect
                  </p>
                  <p className="text-xs text-foreground/60">
                    100% attendance rate in HR & Admin department
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-warning/10">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-warning shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Leave Requests Pending
                  </p>
                  <p className="text-xs text-foreground/60">
                    12 leave requests awaiting approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
