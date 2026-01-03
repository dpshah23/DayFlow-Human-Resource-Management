// File: app/(protected)/admin/(crm)/configs/leave-config.tsx
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
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { addToast } from "@heroui/toast";

import { BaseEntity, TableConfig } from "../_context/table-context";
import {
  LeaveViewModal,
  LeaveEditModal,
  LeaveCreateModal,
  LeaveDeleteModal,
  LeaveBulkDeleteModal,
} from "../_components/leave-modals";
import { ModalConfig, useModalActions } from "../_context/modal-context";

import {
  createLeaveAction,
  updateLeaveAction,
  deleteLeaveAction,
  bulkDeleteLeavesAction,
} from "@/actions/data/leave";
import { findAllLeaves } from "@/lib/db/leave";
import { formatZonedDate } from "@/lib/util";

// Define the Leave type with relations
export interface Leave extends BaseEntity {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  leaveType: "PAID" | "SICK" | "UNPAID";
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const leaveTypeColorMap: Record<string, "primary" | "secondary" | "default"> = {
  PAID: "primary",
  SICK: "secondary",
  UNPAID: "default",
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

// Server actions implementation
const leaveActions = {
  findAll: async (): Promise<Leave[]> => {
    const leaves = await findAllLeaves();

    return leaves as Leave[];
  },
  create: async (data: any): Promise<Leave> => {
    const res = await createLeaveAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Leave;
  },
  update: async (id: string | number, data: any): Promise<Leave> => {
    const res = await updateLeaveAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Leave;
  },
  delete: async (id: string | number): Promise<void> => {
    const res = await deleteLeaveAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteLeavesAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
  approve: async (leave: Leave): Promise<Leave> => {
    const res = await updateLeaveAction(leave.id, { status: "APPROVED" });

    if (!res.success || !res.data) throw new Error(res.message);
    addToast({
      color: "success",
      title: "Leave approved successfully",
    });
    findAllLeaves();

    return res.data as Leave;
  },
};

export const leaveConfig: TableConfig<Leave> = {
  id: "leave",
  name: "Leaves",
  columns: [
    {
      name: "Employee",
      uid: "user",
      sortable: true,
      customRender: (leave: Leave) => (
        <User
          avatarProps={{
            radius: "lg",
            src: leave.user.image || undefined,
            name: leave.user.name[0],
          }}
          description={leave.user.email}
          name={leave.user.name}
        >
          {leave.user.email}
        </User>
      ),
    },
    {
      name: "Leave Type",
      uid: "leaveType",
      sortable: true,
      customRender: (leave: Leave) => (
        <Chip
          className="capitalize"
          color={leaveTypeColorMap[leave.leaveType]}
          size="sm"
          variant="flat"
        >
          {leave.leaveType}
        </Chip>
      ),
    },
    {
      name: "Duration",
      uid: "duration",
      sortable: false,
      customRender: (leave: Leave) => {
        const days = calculateDays(leave.startDate, leave.endDate);

        return (
          <div className="flex flex-col">
            <span className="font-semibold">{days} day(s)</span>
            <span className="text-xs text-foreground/60">
              {new Date(leave.startDate).toLocaleDateString()} -{" "}
              {new Date(leave.endDate).toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      name: "Start Date",
      uid: "startDate",
      sortable: true,
      customRender: (leave: Leave) => formatZonedDate(leave.startDate),
    },
    {
      name: "End Date",
      uid: "endDate",
      sortable: true,
      customRender: (leave: Leave) => formatZonedDate(leave.endDate),
    },
    {
      name: "Reason",
      uid: "reason",
      sortable: false,
      customRender: (leave: Leave) => (
        <div className="max-w-xs truncate" title={leave.reason}>
          {leave.reason}
        </div>
      ),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (leave: Leave) => (
        <Chip
          className="capitalize"
          color={statusColorMap[leave.status]}
          size="sm"
          startContent={
            leave.status === "APPROVED" ? (
              <CheckCircle size={14} />
            ) : leave.status === "REJECTED" ? (
              <XCircle size={14} />
            ) : undefined
          }
          variant="flat"
        >
          {leave.status}
        </Chip>
      ),
    },
    {
      name: "Applied On",
      uid: "createdAt",
      sortable: true,
      customRender: (leave: Leave) => formatZonedDate(leave.createdAt),
    },
    {
      name: "Updated",
      uid: "updatedAt",
      sortable: true,
      customRender: (leave: Leave) => formatZonedDate(leave.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (leave: Leave) => (
        <div className="relative flex items-center justify-end gap-2">
          <LeaveActionsDropdown leave={leave} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "status",
    options: [
      { name: "Pending", uid: "PENDING" },
      { name: "Approved", uid: "APPROVED" },
      { name: "Rejected", uid: "REJECTED" },
    ],
  },
  initialVisibleColumns: [
    "user",
    "leaveType",
    "duration",
    "status",
    "createdAt",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by employee name, email, or reason...",
    searchableFields: [
      "user.name",
      "user.email",
      "reason",
      "leaveType",
      "status",
    ],
  },
  actions: leaveActions,
};

export const leaveModalConfig: ModalConfig<Leave> = {
  view: {
    component: LeaveViewModal,
    title: "View Leave Application",
  },
  edit: {
    component: LeaveEditModal,
    title: "Edit Leave Application",
  },
  create: {
    component: LeaveCreateModal,
    title: "Create Leave Application",
  },
  delete: {
    component: LeaveDeleteModal,
    title: "Delete Leave Application",
  },
  bulkDelete: {
    component: LeaveBulkDeleteModal,
    title: "Bulk Delete Leave Applications",
  },
};

const handleApprove = leaveActions.approve;

const LeaveActionsDropdown = ({ leave }: { leave: Leave }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<Leave>();

  const handleAction = (action: "approve" | "view" | "edit" | "delete") => {
    switch (action) {
      case "approve":
        handleApprove(leave);
        break;
      case "view":
        handleView(leave);
        break;
      case "edit":
        handleEdit(leave);
        break;
      case "delete":
        handleDelete(leave);
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
        <DropdownItem key="approve" startContent={<Eye className="w-4 h-4" />}>
          Approve
        </DropdownItem>
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
