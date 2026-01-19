import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/data/tasks";
import { users } from "@/data/users";

const statusColors = {
  todo: "secondary",
  "in-progress": "default",
  done: "outline",
} as const;

const priorityColors = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const;

export const taskColumns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm text-muted-foreground">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as Task["status"];
      return <Badge variant={statusColors[status]}>{status.replace("-", " ")}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as Task["priority"];
      return <Badge variant={priorityColors[priority]}>{priority}</Badge>;
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
    cell: ({ row }) => {
      const assigneeId = row.getValue("assignee") as string;
      const user = users.find((u) => u.id === assigneeId);
      return <div>{user?.name || "Unassigned"}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];
