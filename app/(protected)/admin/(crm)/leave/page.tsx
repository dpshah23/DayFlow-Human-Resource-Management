// File: app/(protected)/admin/(crm)/leaves/page.tsx
"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../_context/layout-context";
import { TableProvider } from "../_context/table-context";
import { ModalProvider } from "../_context/modal-context";
import { GenericTable } from "../_components/generic-table";
import { Leave, leaveConfig, leaveModalConfig } from "../_configs/leave-config";

export default function LeavesPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: leaveConfig.name },
    ]);
    setActiveMenuItem(leaveConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<Leave> config={leaveConfig}>
      <ModalProvider<Leave> config={leaveModalConfig}>
        <GenericTable<Leave> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
