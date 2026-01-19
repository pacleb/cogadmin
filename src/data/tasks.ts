export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string; // user id
  dueDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export const tasks: Task[] = [
  {
    id: "1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new admin dashboard",
    status: "in-progress",
    priority: "high",
    assignee: "1",
    dueDate: "2026-01-25",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-19T14:00:00Z",
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "done",
    priority: "high",
    assignee: "2",
    dueDate: "2026-01-20",
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-01-18T16:00:00Z",
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints",
    status: "todo",
    priority: "medium",
    assignee: "1",
    dueDate: "2026-01-30",
    createdAt: "2026-01-12T11:00:00Z",
    updatedAt: "2026-01-12T11:00:00Z",
  },
  {
    id: "4",
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment",
    status: "in-progress",
    priority: "medium",
    assignee: "2",
    dueDate: "2026-01-28",
    createdAt: "2026-01-14T08:00:00Z",
    updatedAt: "2026-01-19T10:00:00Z",
  },
  {
    id: "5",
    title: "Optimize database queries",
    description: "Improve performance of slow database queries",
    status: "todo",
    priority: "low",
    assignee: "1",
    dueDate: "2026-02-05",
    createdAt: "2026-01-16T13:00:00Z",
    updatedAt: "2026-01-16T13:00:00Z",
  },
];
