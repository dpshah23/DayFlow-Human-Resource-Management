// File: app/(protected)/admin/(crm)/_components/leave-modals.tsx
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import {
  Eye,
  Pencil,
  Trash,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { User as HeroUIUser } from "@heroui/user";
import { parseDate } from "@internationalized/date";

import { Leave } from "../_configs/leave-config";
import { useTableContext } from "../_context/table-context";

import { formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

// Leave Type options
const leaveTypeOptions = [
  { key: "PAID", label: "Paid Leave" },
  { key: "SICK", label: "Sick Leave" },
  { key: "UNPAID", label: "Unpaid Leave" },
];

// Status options
const statusOptions = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

// Status config
const statusConfig = {
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

// Calculate leave duration
const calculateDays = (startDate: Date, endDate: Date) => {
  const days =
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  return days;
};

// ==================== VIEW MODAL ====================
export const LeaveViewModal = ({
  item: leave,
  isOpen,
  onOpenChange,
}: {
  item: Leave;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const status = statusConfig[leave.status];
  const StatusIcon = status.icon;
  const days = calculateDays(leave.startDate, leave.endDate);

  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                View Leave Application
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              {/* Employee Info */}
              <div className="flex items-center gap-4">
                <HeroUIUser
                  avatarProps={{
                    src: leave.user.image || undefined,
                    name: leave.user.name[0],
                  }}
                  description={leave.user.email}
                  name={leave.user.name}
                />
              </div>

              <Divider />

              {/* Leave Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Chip
                    color={status.color}
                    startContent={<StatusIcon size={14} />}
                    variant="flat"
                  >
                    {status.label}
                  </Chip>
                  <Chip variant="flat">
                    {
                      leaveTypeOptions.find((t) => t.key === leave.leaveType)
                        ?.label
                    }
                  </Chip>
                  <Chip variant="flat">
                    <Calendar className="mr-1" size={14} />
                    {days} day(s)
                  </Chip>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-foreground/60">Start Date</p>
                    <p className="font-medium">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">End Date</p>
                    <p className="font-medium">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-foreground/60">Reason</p>
                  <p className="p-3 text-sm rounded-lg bg-content2">
                    {leave.reason}
                  </p>
                </div>
              </div>

              <Divider />

              {/* Timestamps */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-foreground/60">Applied On</p>
                  <p className="text-sm">{formatZonedDate(leave.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Last Updated</p>
                  <p className="text-sm">{formatZonedDate(leave.updatedAt)}</p>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== EDIT MODAL ====================
export const LeaveEditModal = ({
  item: leave,
  isOpen,
  onOpenChange,
}: {
  item: Leave;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<Leave>();
  const [form, setForm] = useState({
    leaveType: leave.leaveType,
    startDate: parseDate(new Date(leave.startDate).toISOString().split("T")[0]),
    endDate: parseDate(new Date(leave.endDate).toISOString().split("T")[0]),
    reason: leave.reason,
    status: leave.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.leaveType || !form.startDate || !form.endDate || !form.reason) {
      addToast({
        title: "Validation Error",
        description: "All fields are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      // Convert CalendarDate to JavaScript Date
      const startDate = new Date(
        form.startDate.year,
        form.startDate.month - 1,
        form.startDate.day,
      );
      const endDate = new Date(
        form.endDate.year,
        form.endDate.month - 1,
        form.endDate.day,
      );

      await updateItem(leave.id, {
        leaveType: form.leaveType,
        startDate,
        endDate,
        reason: form.reason,
        status: form.status,
      });

      addToast({
        title: "Leave updated",
        description: "Leave application updated successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update leave",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" /> Edit Leave Application
            </ModalHeader>

            <ModalBody className="space-y-4">
              {/* Employee Info (Read-only) */}
              <div className="p-4 rounded-lg bg-content2">
                <HeroUIUser
                  avatarProps={{
                    src: leave.user.image || undefined,
                    name: leave.user.name[0],
                  }}
                  description={leave.user.email}
                  name={leave.user.name}
                />
              </div>

              <div className="flex gap-4">
                <Select
                  label="Leave Type"
                  selectedKeys={new Set([form.leaveType])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, leaveType: Array.from(keys)[0] as any })
                  }
                >
                  {leaveTypeOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Status"
                  selectedKeys={new Set([form.status])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, status: Array.from(keys)[0] as any })
                  }
                >
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex gap-4">
                <DatePicker
                  label="Start Date"
                  value={form.startDate}
                  variant="flat"
                  onChange={(date) => {
                    if (!date) return;
                    setForm({ ...form, startDate: date });
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={form.endDate}
                  variant="flat"
                  onChange={(date) => {
                    if (!date) return;
                    setForm({ ...form, endDate: date });
                  }}
                />
              </div>

              <Textarea
                label="Reason"
                maxRows={5}
                minRows={3}
                value={form.reason}
                variant="flat"
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== CREATE MODAL ====================
export const LeaveCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<Leave>();
  const [form, setForm] = useState({
    userId: "",
    leaveType: "PAID" as const,
    startDate: null as any,
    endDate: null as any,
    reason: "",
    status: "PENDING" as const,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (
      !form.userId ||
      !form.leaveType ||
      !form.startDate ||
      !form.endDate ||
      !form.reason
    ) {
      addToast({
        title: "Validation Error",
        description: "All fields are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      // Convert CalendarDate to JavaScript Date
      const startDate = new Date(
        form.startDate.year,
        form.startDate.month - 1,
        form.startDate.day,
      );
      const endDate = new Date(
        form.endDate.year,
        form.endDate.month - 1,
        form.endDate.day,
      );

      await createItem({
        userId: form.userId,
        leaveType: form.leaveType,
        startDate,
        endDate,
        reason: form.reason,
        status: form.status,
      });

      addToast({
        title: "Leave created",
        description: "Leave application created successfully",
        color: "success",
      });

      // Reset form
      setForm({
        userId: "",
        leaveType: "PAID",
        startDate: null,
        endDate: null,
        reason: "",
        status: "PENDING",
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create leave",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" /> Create Leave
              Application
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="User ID"
                placeholder="Enter user ID"
                value={form.userId}
                variant="flat"
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />

              <div className="flex gap-4">
                <Select
                  label="Leave Type"
                  selectedKeys={new Set([form.leaveType])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, leaveType: Array.from(keys)[0] as any })
                  }
                >
                  {leaveTypeOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Status"
                  selectedKeys={new Set([form.status])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, status: Array.from(keys)[0] as any })
                  }
                >
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex gap-4">
                <DatePicker
                  label="Start Date"
                  value={form.startDate}
                  variant="flat"
                  onChange={(date) => setForm({ ...form, startDate: date })}
                />
                <DatePicker
                  label="End Date"
                  value={form.endDate}
                  variant="flat"
                  onChange={(date) => setForm({ ...form, endDate: date })}
                />
              </div>

              <Textarea
                label="Reason"
                maxRows={5}
                minRows={3}
                placeholder="Enter reason for leave"
                value={form.reason}
                variant="flat"
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSave}
              >
                Create Leave
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const LeaveDeleteModal = ({
  item: leave,
  isOpen,
  onOpenChange,
}: {
  item: Leave;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<Leave>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(leave.id);

      addToast({
        title: "Leave deleted",
        description: "Leave application removed successfully",
        color: "success",
      });
      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete leave",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-danger" /> Delete Leave Application
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete leave application from{" "}
                  <strong>{leave.user.name}</strong>?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  Leave Type: <strong>{leave.leaveType}</strong>
                  <br />
                  Duration: {new Date(
                    leave.startDate,
                  ).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== BULK DELETE MODAL ====================
export const LeaveBulkDeleteModal = ({
  items: [...leaves],
  isOpen,
  onOpenChange,
}: {
  items: Leave[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Leave>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(leaves as unknown as string[]);

      addToast({
        title: "Leaves deleted",
        description: "Leave applications removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete leaves",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-danger" /> Delete Leave
              Applications
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {leaves.length} leave application
                    {leaves.length > 1 ? "s" : ""}
                  </strong>
                  ?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
