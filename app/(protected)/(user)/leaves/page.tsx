// File: app/(protected)/(user)/profile/leaves/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import {
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "@/hooks/useUser";
import {
  applyLeaveAction,
  cancelLeaveAction,
  fetchUserLeavesAction,
} from "@/actions/data/leave";
import { PageTitle } from "@/components/ui/reusable-components";
import { ApplyLeaveSchema } from "@/schemas";

const leaveTypes = [
  { value: "SICK", label: "Sick Leave" },
  { value: "CASUAL", label: "Casual Leave" },
  { value: "ANNUAL", label: "Annual Leave" },
  { value: "UNPAID", label: "Unpaid Leave" },
];

const statusConfig: Record<
  string,
  {
    color: "warning" | "success" | "danger";
    icon: React.ComponentType;
    label: string;
  }
> = {
  PENDING: {
    color: "warning" as const,
    icon: Clock,
    label: "Pending",
  },
  APPROVED: {
    color: "success" as const,
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "danger" as const,
    icon: XCircle,
    label: "Rejected",
  },
};

export default function LeavesPage() {
  const { user: currentUser } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [leaves, setLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(ApplyLeaveSchema),
    defaultValues: {
      leaveType: undefined,
      startDate: undefined,
      endDate: undefined,
      reason: "",
    },
  });

  // Fetch leaves
  useEffect(() => {
    if (currentUser?.id) {
      fetchLeaves();
    }
  }, [currentUser?.id]);

  const fetchLeaves = async () => {
    if (!currentUser?.id) return;

    setIsLoading(true);
    const response = await fetchUserLeavesAction(currentUser.id);

    if (response.success && response.data) {
      setLeaves(response.data);
    } else {
      addToast({
        title: "Error",
        description: response.message || "Failed to load leaves",
        color: "danger",
      });
    }
    setIsLoading(false);
  };

  // Apply for leave
  const onSubmit = (data: any) => {
    if (!currentUser?.id) return;

    startTransition(async () => {
      // Convert CalendarDate to JavaScript Date
      const startDate = new Date(
        data.startDate.year,
        data.startDate.month - 1,
        data.startDate.day,
      );
      const endDate = new Date(
        data.endDate.year,
        data.endDate.month - 1,
        data.endDate.day,
      );

      const response = await applyLeaveAction({
        userId: currentUser.id,
        leaveType: data.leaveType,
        startDate,
        endDate,
        reason: data.reason,
      });

      if (response.success) {
        addToast({
          title: "Success",
          description: "Leave application submitted successfully",
          color: "success",
        });
        form.reset();
        onOpenChange();
        fetchLeaves();
      } else {
        addToast({
          title: "Error",
          description: response.message || "Failed to apply for leave",
          color: "danger",
        });
      }
    });
  };

  // Cancel leave
  const handleCancelLeave = (leaveId: string) => {
    startTransition(async () => {
      const response = await cancelLeaveAction(leaveId);

      if (response.success) {
        addToast({
          title: "Success",
          description: "Leave cancelled successfully",
          color: "success",
        });
        fetchLeaves();
      } else {
        addToast({
          title: "Error",
          description: response.message || "Failed to cancel leave",
          color: "danger",
        });
      }
    });
  };

  // Calculate leave duration
  const calculateDays = (startDate: Date, endDate: Date) => {
    const days =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    return days;
  };

  // Statistics
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
  };

  if (!currentUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <section className="size-full">
      <div className="flex items-center justify-between mb-6">
        <PageTitle
          centered={false}
          subtitle="View and manage your leave applications"
          title="My Leaves"
        />
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <Card className="bg-content2">
          <CardBody className="text-center">
            <p className="text-sm text-foreground/60">Total Applications</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </CardBody>
        </Card>
        <Card className="bg-content2">
          <CardBody className="text-center">
            <p className="text-sm text-foreground/60">Pending</p>
            <p className="text-3xl font-bold text-warning">{stats.pending}</p>
          </CardBody>
        </Card>
        <Card className="bg-content2">
          <CardBody className="text-center">
            <p className="text-sm text-foreground/60">Approved</p>
            <p className="text-3xl font-bold text-success">{stats.approved}</p>
          </CardBody>
        </Card>
        <Card className="bg-content2">
          <CardBody className="text-center">
            <p className="text-sm text-foreground/60">Rejected</p>
            <p className="text-3xl font-bold text-danger">{stats.rejected}</p>
          </CardBody>
        </Card>
      </div>

      {/* Leaves List */}
      <div className="space-y-4">
        {leaves.length === 0 ? (
          <Card className="bg-content2">
            <CardBody className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No leaves yet
              </h3>
              <p className="mb-4 text-sm text-foreground/60">
                You haven&apos;t applied for any leaves. Click &quot;Apply for
                Leave&quot; get started.
              </p>
            </CardBody>
          </Card>
        ) : (
          leaves.map((leave) => {
            const status = statusConfig[leave.status];
            const StatusIcon: any = status.icon;
            const days = calculateDays(leave.startDate, leave.endDate);

            return (
              <Card key={leave.id} className="bg-content2">
                <CardBody className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Chip
                          color={status.color}
                          startContent={<StatusIcon size={14} />}
                          variant="flat"
                        >
                          {status.label}
                        </Chip>
                        <Chip variant="flat">
                          {leaveTypes.find((t) => t.value === leave.leaveType)
                            ?.label || leave.leaveType}
                        </Chip>
                        <Chip variant="flat">{days} day(s)</Chip>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="text-foreground/60" size={16} />
                          <span className="text-foreground">
                            {new Date(leave.startDate).toLocaleDateString()} -{" "}
                            {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80">
                          {leave.reason}
                        </p>
                      </div>

                      <p className="text-xs text-foreground/50">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {leave.status === "PENDING" && (
                      <Button
                        color="danger"
                        isDisabled={isPending}
                        size="sm"
                        startContent={<Trash2 size={16} />}
                        variant="flat"
                        onPress={() => handleCancelLeave(leave.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Apply for Leave
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {/* Leave Type */}
                  <Controller
                    control={form.control}
                    name="leaveType"
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                        label="Leave Type"
                        placeholder="Select leave type"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0] as string;

                          field.onChange(value);
                        }}
                      >
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.value}>{type.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {/* Start Date */}
                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({ field, fieldState }) => (
                      <DatePicker
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                        label="Start Date"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* End Date */}
                  <Controller
                    control={form.control}
                    name="endDate"
                    render={({ field, fieldState }) => (
                      <DatePicker
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                        label="End Date"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Reason */}
                  <Controller
                    control={form.control}
                    name="reason"
                    render={({ field, fieldState }) => (
                      <Textarea
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                        label="Reason"
                        maxRows={5}
                        minRows={3}
                        placeholder="Please provide a reason for your leave application"
                      />
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" isLoading={isPending} type="submit">
                  Submit Application
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
