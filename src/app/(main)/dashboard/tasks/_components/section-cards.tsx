import { AlertCircle, CheckCircle, Clock, ListTodo } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardsProps {
  tasks: Array<{
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
  }>;
}

export function SectionCards({ tasks }: SectionCardsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const _highPriorityTasks = tasks.filter((task) => task.priority === "high").length;

  const cards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      description: "All tasks in the system",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      description: "Tasks marked as done",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      description: "Currently being worked on",
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: AlertCircle,
      description: "Pending tasks",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
