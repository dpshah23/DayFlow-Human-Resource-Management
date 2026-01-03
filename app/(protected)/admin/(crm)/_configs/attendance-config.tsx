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
  AttendanceViewModal,
  AttendanceEditModal,
  AttendanceCreateModal,
  AttendanceDeleteModal,
  AttendanceBulkDeleteModal,
} from "../_components/attendance-modals";

import { formatZonedDate } from "@/lib/util";
import { findAllAttendances } from "@/lib/db/attendance";
import {
  bulkDeleteAttendancesAction,
  createAttendanceAction,
  deleteAttendanceAction,
  updateAttendanceAction,
} from "@/actions/data/attendance";

export interface Attendance extends BaseEntity {
  id: string;
  userId: string;
  date: Date;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  PRESENT: "success",
  ABSENT: "danger",
  HALF_DAY: "warning",
  LEAVE: "default",
};

const attendanceActions = {
  findAll: async (): Promise<Attendance[]> => {
    const attendances = await findAllAttendances();

    return attendances as Attendance[];
  },
  create: async (data: any): Promise<Attendance> => {
    const res = await createAttendanceAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Attendance;
  },
  update: async (id: string | number, data: any): Promise<Attendance> => {
    const res = await updateAttendanceAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Attendance;
  },
  delete: async (id: string | number): Promise<void> => {
    const res = await deleteAttendanceAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteAttendancesAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

export const attendanceConfig: TableConfig<Attendance> = {
  id: "attendance",
  name: "Attendance",
  columns: [
    {
      name: "Employee",
      uid: "user",
      sortable: true,
      customRender: (attendance: Attendance) => (
        <User
          avatarProps={{
            radius: "lg",
            name: attendance.user.name[0],
            src: attendance.user.image || undefined,
          }}
          description={attendance.user.email}
          name={attendance.user.name}
        >
          {attendance.user.email}
        </User>
      ),
    },
    {
      name: "Date",
      uid: "date",
      sortable: true,
      customRender: (attendance: Attendance) =>
        formatZonedDate(attendance.date),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (attendance: Attendance) => (
        <Chip
          className="capitalize"
          color={statusColorMap[attendance.status] || "default"}
          size="sm"
          variant="flat"
        >
          {attendance.status.replace("_", " ")}
        </Chip>
      ),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (attendance: Attendance) => (
        <div className="relative flex items-center justify-end gap-2">
          <AttendanceActionsDropdown attendance={attendance} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "status",
    options: [
      { name: "Present", uid: "PRESENT" },
      { name: "Absent", uid: "ABSENT" },
      { name: "Half Day", uid: "HALF_DAY" },
      { name: "Leave", uid: "LEAVE" },
    ],
  },
  initialVisibleColumns: ["user", "date", "status", "actions"],
  searchOption: {
    placeholder: "Search by employee name or email...",
    searchableFields: ["user.name", "user.email", "status"],
  },
  actions: attendanceActions,
};

export const attendanceModalConfig: ModalConfig<Attendance> = {
  view: {
    component: AttendanceViewModal,
    title: "View Attendance",
  },
  edit: {
    component: AttendanceEditModal,
    title: "Edit Attendance",
  },
  create: {
    component: AttendanceCreateModal,
    title: "Create Attendance",
  },
  delete: {
    component: AttendanceDeleteModal,
    title: "Delete Attendance",
  },
  bulkDelete: {
    component: AttendanceBulkDeleteModal,
    title: "Bulk Delete Attendance",
  },
};

const AttendanceActionsDropdown = ({
  attendance,
}: {
  attendance: Attendance;
}) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<Attendance>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(attendance);
        break;
      case "edit":
        handleEdit(attendance);
        break;
      case "delete":
        handleDelete(attendance);
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
