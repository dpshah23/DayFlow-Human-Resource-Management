// File: app\(public)\page.tsx
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  Star,
  CheckCircle,
  BarChart3,
  Calendar,
  Shield,
  Clock,
  UserCheck,
  FileText,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";

import {
  Section,
  SectionTitle,
  ContentCard,
  TextBlock,
  StatCard,
} from "@/components/ui/reusable-components";
import FadeInSection from "@/components/ui/animations/fade-in-section";
import StaggeredFadeInList from "@/components/ui/animations/staggered-fade-in-list";

export default function DayflowLanding() {
  return (
    <div className="min-h-screen bg-background">
      <StaggeredFadeInList>
        {/* Hero Section */}
        <Section className="relative pt-24 pb-12 overflow-hidden bg-gradient-to-br from-background via-content1 to-content2">
          <FadeInSection>
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <StaggeredFadeInList>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Chip
                        className="animate-pulse"
                        color="primary"
                        startContent={<Zap className="w-4 h-4" />}
                        variant="flat"
                      >
                        Modern HR Management Solution
                      </Chip>
                      <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
                        <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                          Every Workday,
                        </span>
                        <br />
                        Perfectly
                        <br />
                        <span className="text-primary">Aligned</span>
                      </h1>
                      <p className="max-w-xl text-lg text-foreground/60">
                        Streamline your HR operations with Dayflow. From
                        employee onboarding to payroll management, we digitize
                        and simplify every aspect of human resource management.
                      </p>
                    </div>

                    <div className="flex items-center pt-4 space-x-8">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          <Avatar
                            size="sm"
                            src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png"
                          />
                          <Avatar
                            size="sm"
                            src="https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png"
                          />
                          <Avatar
                            size="sm"
                            src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            500+ Companies
                          </p>
                          <p className="text-xs text-foreground/60">Trust us</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-foreground">
                          4.9/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
                    <Card className="relative border backdrop-blur-xs bg-content1/50 border-content2">
                      <CardBody className="p-8">
                        <div className="space-y-6">
                          <StaggeredFadeInList>
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-foreground">
                                HR Dashboard Overview
                              </h3>
                              <Chip color="success" size="sm" variant="flat">
                                Live
                              </Chip>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <StaggeredFadeInList>
                                <StatCard
                                  change="+5 today"
                                  decimals={0}
                                  icon={
                                    <Users className="w-5 h-5 text-primary" />
                                  }
                                  title="Active Employees"
                                  trend="up"
                                  value="247"
                                />
                                <StatCard
                                  change="+2.3%"
                                  decimals={1}
                                  icon={
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                  }
                                  suffix="%"
                                  title="Attendance Rate"
                                  trend="up"
                                  value="96.8"
                                />
                              </StaggeredFadeInList>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground/60">
                                  Leave Requests
                                </span>
                                <span className="text-foreground">
                                  12 Pending
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-content2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                                  style={{ width: "45%" }}
                                />
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="text-foreground/60">
                                  Onboarding Tasks
                                </span>
                                <span className="text-foreground">
                                  8/10 Complete
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-content2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                                  style={{ width: "80%" }}
                                />
                              </div>
                            </div>
                          </StaggeredFadeInList>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </StaggeredFadeInList>
              </div>
            </div>
          </FadeInSection>
        </Section>

        {/* Stats Section */}
        <Section background="content1" padding="default">
          <FadeInSection>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StaggeredFadeInList>
                <StatCard
                  icon={<Users className="w-6 h-6 text-primary" />}
                  suffix="+"
                  title="Employees Managed"
                  value="10000"
                />
                <StatCard
                  icon={<Clock className="w-6 h-6 text-primary" />}
                  suffix="%"
                  title="Time Saved"
                  value="75"
                />
                <StatCard
                  icon={<CheckCircle className="w-6 h-6 text-primary" />}
                  suffix="%"
                  title="Process Automation"
                  value="90"
                />
                <StatCard
                  icon={<Shield className="w-6 h-6 text-primary" />}
                  suffix="+"
                  title="Companies Trust Us"
                  value="500"
                />
              </StaggeredFadeInList>
            </div>
          </FadeInSection>
        </Section>

        {/* Features Section */}
        <Section id="features" padding="large">
          <FadeInSection>
            <SectionTitle
              subtitle="Comprehensive HR solutions designed for modern workplaces"
              title="Core Features"
            />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <StaggeredFadeInList>
                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <UserCheck className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Employee Onboarding
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Streamline your onboarding process with automated
                      workflows. Manage employee profiles, documents, and
                      verification in one centralized platform for a smooth
                      first-day experience.
                    </p>
                  </TextBlock>
                </ContentCard>

                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                        <ClipboardCheck className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Attendance Tracking
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Track daily and weekly attendance with ease. Support for
                      check-in/check-out, multiple status types, and
                      comprehensive reporting for both employees and
                      administrators.
                    </p>
                  </TextBlock>
                </ContentCard>

                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Leave Management
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Simplify leave requests and approvals with intuitive
                      workflows. Support for multiple leave types, automated
                      approval chains, and real-time status updates for
                      transparency.
                    </p>
                  </TextBlock>
                </ContentCard>

                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                        <DollarSign className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Payroll Management
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Manage salary structures and payroll with precision.
                      Employees get visibility into their compensation while
                      admins maintain full control over payroll operations.
                    </p>
                  </TextBlock>
                </ContentCard>

                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Role-Based Access
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Secure your data with role-based permissions. Different
                      access levels for admins, HR officers, and employees
                      ensure data security and appropriate information
                      visibility.
                    </p>
                  </TextBlock>
                </ContentCard>

                <ContentCard
                  className="transition-transform duration-300 group hover:scale-105"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                        <BarChart3 className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Analytics & Reports
                      </h3>
                    </div>
                  }
                >
                  <TextBlock>
                    <p>
                      Generate comprehensive reports on attendance, leaves, and
                      payroll. Data-driven insights help you make informed
                      decisions about your workforce management.
                    </p>
                  </TextBlock>
                </ContentCard>
              </StaggeredFadeInList>
            </div>
          </FadeInSection>
        </Section>

        {/* About Section */}
        <Section background="content1" id="about" padding="large">
          <FadeInSection>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <SectionTitle
                  centered={false}
                  subtitle="Redefining workplace efficiency"
                  title="Why Choose Dayflow?"
                />

                <TextBlock className="text-lg">
                  <p>
                    Dayflow was built to address the growing complexities of
                    modern HR management. We understand that managing people is
                    about more than just data—it&apos;s about creating seamless
                    experiences.
                  </p>
                  <p>
                    Our platform combines powerful automation with intuitive
                    design, making HR tasks effortless for everyone. From your
                    newest hire to your seasoned HR team, Dayflow ensures every
                    workday is perfectly aligned.
                  </p>
                </TextBlock>

                <div className="flex flex-wrap gap-3">
                  <Chip color="primary" variant="flat">
                    Cloud-Based
                  </Chip>
                  <Chip color="secondary" variant="flat">
                    Secure
                  </Chip>
                  <Chip color="success" variant="flat">
                    Scalable
                  </Chip>
                  <Chip color="warning" variant="flat">
                    User-Friendly
                  </Chip>
                </div>
              </div>

              <div className="relative">
                <Card className="backdrop-blur-xs bg-content2/50">
                  <CardBody className="p-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-foreground">
                        Ready to Get Started?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-foreground/60">
                            Free demo & consultation
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-foreground/60">
                            Easy migration from existing systems
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-foreground/60">
                            24/7 dedicated support
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-foreground/60">
                            Regular updates and improvements
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </FadeInSection>
        </Section>

        {/* Use Cases Section */}
        <Section className="bg-content2" padding="large">
          <FadeInSection>
            <SectionTitle
              subtitle="Perfect for organizations of all sizes"
              title="Who Uses Dayflow?"
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StaggeredFadeInList>
                {[
                  {
                    name: "Startups",
                    icon: <Zap />,
                    color: "primary",
                    description: "Scale your team efficiently",
                  },
                  {
                    name: "SMBs",
                    icon: <Target />,
                    color: "secondary",
                    description: "Streamline HR operations",
                  },
                  {
                    name: "Enterprises",
                    icon: <Users />,
                    color: "success",
                    description: "Manage large workforces",
                  },
                  {
                    name: "Tech Companies",
                    icon: <FileText />,
                    color: "warning",
                    description: "Modern HR for modern teams",
                  },
                  {
                    name: "Remote Teams",
                    icon: <Clock />,
                    color: "danger",
                    description: "Coordinate across time zones",
                  },
                  {
                    name: "HR Agencies",
                    icon: <Shield />,
                    color: "primary",
                    description: "Manage multiple clients",
                  },
                ].map((useCase) => (
                  <Card
                    key={useCase.name}
                    className="transition-transform duration-300 group hover:scale-105 bg-content1"
                  >
                    <CardBody className="p-6 text-center">
                      <div className="mb-4 text-4xl">{useCase.icon}</div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {useCase.name}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {useCase.description}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </StaggeredFadeInList>
            </div>
          </FadeInSection>
        </Section>
      </StaggeredFadeInList>
    </div>
  );
}
