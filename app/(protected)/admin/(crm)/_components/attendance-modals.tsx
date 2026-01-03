import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Eye, Pencil, Trash, Calendar } from "lucide-react";
import { useState } from "react";
import { User as HeroUIUser } from "@heroui/user";

import { Attendance } from "../configs/attendance-config";
import { useTableContext } from "../_context/table-context";

import { formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

const statusOptions = [
  { key: "PRESENT", label: "Present" },
  { key: "ABSENT", label: "Absent" },
  { key: "HALF_DAY", label: "Half Day" },
  { key: "LEAVE", label: "Leave" },
];

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  PRESENT: "success",
  ABSENT: "danger",
  HALF_DAY: "warning",
  LEAVE: "default",
};

// ==================== VIEW MODAL ====================
export const AttendanceViewModal = ({
  item: attendance,
  isOpen,
  onOpenChange,
}: {
  item: Attendance;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
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
                View Attendance
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center gap-4">
                <HeroUIUser
                  avatarProps={{
                    src: attendance.user.image || undefined,
                    name: attendance.user.name[0],
                  }}
                  description={attendance.user.email}
                  name={attendance.user.name}
                />
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    {attendance.user.name}
                  </h1>
                  <Chip
                    color={statusColorMap[attendance.status] || "default"}
                    variant="faded"
                  >
                    {attendance.status.replace("_", " ")}
                  </Chip>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <strong>Date:</strong> {formatZonedDate(attendance.date)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {attendance.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Employee:</strong> {attendance.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {attendance.user.email}
                  </p>
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
export const AttendanceEditModal = ({
  item: attendance,
  isOpen,
  onOpenChange,
}: {
  item: Attendance;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<Attendance>();
  const [form, setForm] = useState({
    status: attendance.status,
    date: new Date(attendance.date).toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(attendance.id, {
        status: form.status,
        date: new Date(form.date),
      });

      addToast({
        title: "Attendance updated",
        description: "Attendance record updated successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update attendance",
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
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" /> Edit Attendance
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 rounded-lg bg-content2">
                <p className="text-sm text-foreground/60">Employee</p>
                <p className="font-medium">{attendance.user.name}</p>
                <p className="text-sm text-foreground/60">
                  {attendance.user.email}
                </p>
              </div>

              <Input
                label="Date"
                type="date"
                value={form.date}
                variant="flat"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <Select
                label="Status"
                selectedKeys={new Set([form.status])}
                variant="flat"
                onSelectionChange={(keys) =>
                  setForm({ ...form, status: Array.from(keys)[0] as string })
                }
              >
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.key}>{opt.label}</SelectItem>
                ))}
              </Select>
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
export const AttendanceCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<Attendance>();
  const [form, setForm] = useState({
    userId: "",
    date: new Date().toISOString().split("T")[0],
    status: "PRESENT",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.userId || !form.date || !form.status) {
      addToast({
        title: "Validation Error",
        description: "All fields are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        userId: form.userId,
        date: new Date(form.date),
        status: form.status as any,
      });

      addToast({
        title: "Attendance created",
        description: "New attendance record added successfully",
        color: "success",
      });

      setForm({
        userId: "",
        date: new Date().toISOString().split("T")[0],
        status: "PRESENT",
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create attendance",
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
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Create Attendance
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                label="User ID"
                placeholder="Enter user ID"
                value={form.userId}
                variant="flat"
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />

              <Input
                label="Date"
                type="date"
                value={form.date}
                variant="flat"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <Select
                label="Status"
                selectedKeys={new Set([form.status])}
                variant="flat"
                onSelectionChange={(keys) =>
                  setForm({ ...form, status: Array.from(keys)[0] as string })
                }
              >
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.key}>{opt.label}</SelectItem>
                ))}
              </Select>
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
                Create Attendance
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const AttendanceDeleteModal = ({
  item: attendance,
  isOpen,
  onOpenChange,
}: {
  item: Attendance;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<Attendance>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(attendance.id);

      addToast({
        title: "Attendance deleted",
        description: "Attendance record removed successfully",
        color: "success",
      });
      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete attendance",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Attendance
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete attendance record for{" "}
                  <strong>{attendance.user.name}</strong> on{" "}
                  <strong>{formatZonedDate(attendance.date)}</strong>?
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
export const AttendanceBulkDeleteModal = ({
  items: [...attendances],
  isOpen,
  onOpenChange,
}: {
  items: Attendance[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Attendance>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(attendances.map((a) => a.id));

      addToast({
        title: "Attendances deleted",
        description: "Attendance records removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete attendances",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Attendances
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {attendances.length} attendance record
                    {attendances.length > 1 ? "s" : ""}
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
