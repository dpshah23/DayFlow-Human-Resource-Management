// File: app/(protected)/admin/(crm)/configs/employee-config.tsx
import React from "react";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";

import { TableConfig, BaseEntity } from "../_context/table-context";
import { ModalConfig, useModalActions } from "../_context/modal-context";
import {
  EmployeeViewModal,
  EmployeeEditModal,
  EmployeeCreateModal,
  EmployeeDeleteModal,
  EmployeeBulkDeleteModal,
} from "../_components/employee-modals";

import { formatZonedDate } from "@/lib/util";
import { findAllEmployees } from "@/lib/db/employee";
import {
  bulkDeleteEmployeesAction,
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
} from "@/actions/data/employee";

// Define the Employee type with relations
export interface Employee extends BaseEntity {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "EMPLOYEE";
  profile: {
    id: string;
    employeeId: string;
    name: string;
    phone: string | null;
    address: string | null;
    salary: number | null;
  } | null;
  _count?: {
    attendance: number;
    leaves: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const roleColorMap: Record<string, "success" | "primary" | "default"> = {
  ADMIN: "primary",
  EMPLOYEE: "success",
};

// Server actions implementation
const employeeActions = {
  findAll: async (): Promise<Employee[]> => {
    const employees = await findAllEmployees();

    return employees as Employee[];
  },
  create: async (data: any): Promise<Employee> => {
    const res = await createEmployeeAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Employee;
  },
  update: async (id: string | number, data: any): Promise<Employee> => {
    const res = await updateEmployeeAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Employee;
  },
  delete: async (id: string | number): Promise<void> => {
    const res = await deleteEmployeeAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteEmployeesAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

export const employeeConfig: TableConfig<Employee> = {
  id: "employees",
  name: "Employees",
  columns: [
    {
      name: "Employee",
      uid: "employee",
      sortable: true,
      customRender: (employee: Employee) => (
        <User
          avatarProps={{
            radius: "lg",
            src: employee.image || undefined,
            name: employee.name[0],
          }}
          description={employee.email}
          name={employee.name}
        >
          {employee.email}
        </User>
      ),
    },
    {
      name: "Employee ID",
      uid: "employeeId",
      sortable: true,
      customRender: (employee: Employee) => (
        <span className="font-mono text-sm">
          {employee.profile?.employeeId || "—"}
        </span>
      ),
    },
    {
      name: "Phone",
      uid: "phone",
      sortable: true,
      customRender: (employee: Employee) => (
        <span className="text-sm">{employee.profile?.phone || "—"}</span>
      ),
    },
    {
      name: "Role",
      uid: "role",
      sortable: true,
      customRender: (employee: Employee) => (
        <Chip
          className="capitalize"
          color={roleColorMap[employee.role] || "default"}
          size="sm"
          variant="flat"
        >
          {employee.role}
        </Chip>
      ),
    },
    {
      name: "Salary",
      uid: "salary",
      sortable: true,
      customRender: (employee: Employee) => (
        <span className="font-mono">
          {employee.profile?.salary
            ? `₹${employee.profile.salary.toLocaleString()}`
            : "—"}
        </span>
      ),
    },
    {
      name: "Email Verified",
      uid: "emailVerified",
      sortable: true,
      customRender: (employee: Employee) => (
        <Chip
          color={employee.emailVerified ? "success" : "warning"}
          size="sm"
          variant="flat"
        >
          {employee.emailVerified ? "Verified" : "Not Verified"}
        </Chip>
      ),
    },
    {
      name: "Attendance Records",
      uid: "attendanceCount",
      sortable: true,
      customRender: (employee: Employee) => (
        <span className="text-sm">{employee._count?.attendance || 0}</span>
      ),
    },
    {
      name: "Leave Records",
      uid: "leaveCount",
      sortable: true,
      customRender: (employee: Employee) => (
        <span className="text-sm">{employee._count?.leaves || 0}</span>
      ),
    },
    {
      name: "Created at",
      uid: "createdAt",
      customRender: (employee: Employee) => formatZonedDate(employee.createdAt),
    },
    {
      name: "Updated at",
      uid: "updatedAt",
      customRender: (employee: Employee) => formatZonedDate(employee.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (employee: Employee) => (
        <div className="relative flex items-center justify-end gap-2">
          <EmployeeActionsDropdown employee={employee} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Role",
    column: "role",
    options: [
      { name: "Admin", uid: "ADMIN" },
      { name: "Employee", uid: "EMPLOYEE" },
    ],
  },
  initialVisibleColumns: [
    "employee",
    "employeeId",
    "phone",
    "role",
    "salary",
    "emailVerified",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by name, email, employee ID, or phone...",
    searchableFields: [
      "name",
      "email",
      "profile.employeeId",
      "profile.phone",
      "role",
    ],
  },
  actions: employeeActions,
};

export const employeeModalConfig: ModalConfig<Employee> = {
  view: {
    component: EmployeeViewModal,
    title: "View Employee",
  },
  edit: {
    component: EmployeeEditModal,
    title: "Edit Employee",
  },
  create: {
    component: EmployeeCreateModal,
    title: "Create Employee",
  },
  delete: {
    component: EmployeeDeleteModal,
    title: "Delete Employee",
  },
  bulkDelete: {
    component: EmployeeBulkDeleteModal,
    title: "Bulk Delete Employees",
  },
};

const EmployeeActionsDropdown = ({ employee }: { employee: Employee }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<Employee>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(employee);
        break;
      case "edit":
        handleEdit(employee);
        break;
      case "delete":
        handleDelete(employee);
        break;
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button isIconOnly size="sm" variant="flat">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" onAction={(key) => handleAction(key as any)}>
        <DropdownItem key="view" startContent={<Eye className="w-4 h-4" />}>
          View
        </DropdownItem>
        <DropdownItem key="edit" startContent={<Pencil className="w-4 h-4" />}>
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          color="danger"
          startContent={<Trash className="w-4 h-4" />}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
