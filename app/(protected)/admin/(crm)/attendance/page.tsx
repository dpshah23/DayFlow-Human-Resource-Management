"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../_context/layout-context";
import { TableProvider } from "../_context/table-context";
import { ModalProvider } from "../_context/modal-context";
import { GenericTable } from "../_components/generic-table";
import {
  Attendance,
  attendanceConfig,
  attendanceModalConfig,
} from "../_configs/attendance-config";

export default function AttendancePage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: attendanceConfig.name },
    ]);
    setActiveMenuItem(attendanceConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<Attendance> config={attendanceConfig}>
      <ModalProvider<Attendance> config={attendanceModalConfig}>
        <GenericTable<Attendance> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
