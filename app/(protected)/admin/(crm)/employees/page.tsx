// File: app/(protected)/admin/(crm)/employees/page.tsx
"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../_context/layout-context";
import { TableProvider } from "../_context/table-context";
import { ModalProvider } from "../_context/modal-context";
import { GenericTable } from "../_components/generic-table";
import {
  Employee,
  employeeConfig,
  employeeModalConfig,
} from "../_configs/employee-config";

export default function EmployeesPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: employeeConfig.name },
    ]);
    setActiveMenuItem(employeeConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<Employee> config={employeeConfig}>
      <ModalProvider<Employee> config={employeeModalConfig}>
        <GenericTable<Employee> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
