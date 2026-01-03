// File: app/(protected)/admin/(crm)/_components/employee-modals.tsx
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
import { Eye, Pencil, Trash, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { User as HeroUIUser } from "@heroui/user";

import { Employee } from "../_configs/employee-config";
import { useTableContext } from "../_context/table-context";

import { formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

const roleOptions = [
  { key: "ADMIN", label: "Admin" },
  { key: "EMPLOYEE", label: "Employee" },
];

// ==================== VIEW MODAL ====================
export const EmployeeViewModal = ({
  item: employee,
  isOpen,
  onOpenChange,
}: {
  item: Employee;
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
                View Employee
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-start gap-4">
                <HeroUIUser
                  avatarProps={{
                    src: employee.image || undefined,
                    name: employee.name[0],
                    size: "lg",
                  }}
                  description={employee.email}
                  name={employee.name}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {employee.name}
                    </h1>
                    <Chip
                      color={employee.emailVerified ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {employee.emailVerified ? "Verified" : "Not Verified"}
                    </Chip>
                  </div>
                  <Chip
                    color={employee.role === "ADMIN" ? "primary" : "success"}
                    variant="flat"
                  >
                    {employee.role}
                  </Chip>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-foreground/60">Employee ID</p>
                    <p className="font-mono text-foreground">
                      {employee.profile?.employeeId || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <p className="text-foreground">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Phone</p>
                    <p className="text-foreground">
                      {employee.profile?.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Address</p>
                    <p className="text-foreground">
                      {employee.profile?.address || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-foreground/60">Salary</p>
                    <p className="font-mono text-lg text-foreground">
                      {employee.profile?.salary
                        ? `₹${employee.profile.salary.toLocaleString()}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Role</p>
                    <p className="text-foreground">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">
                      Attendance Records
                    </p>
                    <p className="text-foreground">
                      {employee._count?.attendance || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Leave Records</p>
                    <p className="text-foreground">
                      {employee._count?.leaves || 0}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-foreground/60">Created</p>
                  <p className="text-foreground">
                    {formatZonedDate(employee.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Updated</p>
                  <p className="text-foreground">
                    {formatZonedDate(employee.updatedAt)}
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
export const EmployeeEditModal = ({
  item: employee,
  isOpen,
  onOpenChange,
}: {
  item: Employee;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<Employee>();
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    image: employee.image || "",
    role: employee.role,
    emailVerified: employee.emailVerified,
    profile: {
      employeeId: employee.profile?.employeeId || "",
      name: employee.profile?.name || employee.name,
      phone: employee.profile?.phone || "",
      address: employee.profile?.address || "",
      salary: employee.profile?.salary || 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(employee.id, form);

      addToast({
        title: "Employee updated",
        description: "Employee details updated successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update employee",
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
              <Pencil className="w-5 h-5 text-primary" /> Edit Employee
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Name"
                    value={form.name}
                    variant="flat"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    variant="flat"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <Input
                    label="Image URL"
                    value={form.image}
                    variant="flat"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                  <Select
                    label="Role"
                    selectedKeys={new Set([form.role])}
                    variant="flat"
                    onSelectionChange={(keys) =>
                      setForm({ ...form, role: Array.from(keys)[0] as any })
                    }
                  >
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground/60">
                    Email Verified:
                  </span>
                  <Button
                    color={form.emailVerified ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, emailVerified: !form.emailVerified })
                    }
                  >
                    {form.emailVerified ? "Verified" : "Not Verified"}
                  </Button>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Employee ID"
                    value={form.profile.employeeId}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: {
                          ...form.profile,
                          employeeId: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    label="Profile Name"
                    value={form.profile.name}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, name: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Phone"
                    value={form.profile.phone}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, phone: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Salary"
                    type="number"
                    value={String(form.profile.salary)}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: {
                          ...form.profile,
                          salary: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <Input
                    className="md:col-span-2"
                    label="Address"
                    value={form.profile.address}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, address: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
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
export const EmployeeCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<Employee>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    role: "EMPLOYEE" as "ADMIN" | "EMPLOYEE",
    emailVerified: false,
    profile: {
      employeeId: "",
      name: "",
      phone: "",
      address: "",
      salary: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.profile.employeeId) {
      addToast({
        title: "Validation Error",
        description: "Name, email, and employee ID are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        ...form,
        profile: {
          ...form.profile,
          name: form.profile.name || form.name,
        },
      });

      addToast({
        title: "Employee created",
        description: "New employee added successfully",
        color: "success",
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        image: "",
        role: "EMPLOYEE",
        emailVerified: false,
        profile: {
          employeeId: "",
          name: "",
          phone: "",
          address: "",
          salary: 0,
        },
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create employee",
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
              <UserIcon className="w-5 h-5 text-primary" /> Create Employee
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Name"
                    placeholder="Enter employee name"
                    value={form.name}
                    variant="flat"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    placeholder="Enter email address"
                    type="email"
                    value={form.email}
                    variant="flat"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <Input
                    label="Image URL"
                    placeholder="Enter image URL (optional)"
                    value={form.image}
                    variant="flat"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                  <Select
                    label="Role"
                    selectedKeys={new Set([form.role])}
                    variant="flat"
                    onSelectionChange={(keys) =>
                      setForm({ ...form, role: Array.from(keys)[0] as any })
                    }
                  >
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground/60">
                    Email Verified:
                  </span>
                  <Button
                    color={form.emailVerified ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, emailVerified: !form.emailVerified })
                    }
                  >
                    {form.emailVerified ? "Verified" : "Not Verified"}
                  </Button>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    isRequired
                    label="Employee ID"
                    placeholder="Enter employee ID"
                    value={form.profile.employeeId}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: {
                          ...form.profile,
                          employeeId: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    label="Phone"
                    placeholder="Enter phone number"
                    value={form.profile.phone}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, phone: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Salary"
                    placeholder="Enter salary amount"
                    type="number"
                    value={String(form.profile.salary)}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: {
                          ...form.profile,
                          salary: Number(e.target.value),
                        },
                      })
                    }
                  />
                  <Input
                    className="md:col-span-2"
                    label="Address"
                    placeholder="Enter address"
                    value={form.profile.address}
                    variant="flat"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        profile: { ...form.profile, address: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
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
                Create Employee
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const EmployeeDeleteModal = ({
  item: employee,
  isOpen,
  onOpenChange,
}: {
  item: Employee;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<Employee>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(employee.id);

      addToast({
        title: "Employee deleted",
        description: "Employee removed successfully",
        color: "success",
      });
      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete employee",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Employee
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{employee.name}</strong> (
                  {employee.profile?.employeeId})?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This will also delete all associated attendance and leave
                  records. This action cannot be undone.
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
export const EmployeeBulkDeleteModal = ({
  items: [...employees],
  isOpen,
  onOpenChange,
}: {
  items: Employee[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Employee>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(employees as unknown as string[]);

      addToast({
        title: "Employees deleted",
        description: "Employees removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete employees",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Employees
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {employees.length} employee{employees.length > 1 ? "s" : ""}
                  </strong>
                  ?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This will also delete all associated attendance and leave
                  records. This action cannot be undone.
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
