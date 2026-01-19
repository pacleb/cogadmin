"use client";

import { DataTable as DataTableComponent } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import type { Task } from "@/data/tasks";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { taskColumns } from "./columns";

interface DataTableProps {
  data: Task[];
}

export function DataTable({ data }: DataTableProps) {
  const table = useDataTableInstance({
    data,
    columns: taskColumns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <DataTableComponent table={table} columns={taskColumns} />
      <div className="flex items-center justify-between">
        <DataTablePagination table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
