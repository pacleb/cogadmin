"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/data/tasks";
import { tasks as initialTasks } from "@/data/tasks";

import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import { TaskForm } from "./_components/task-form";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <TaskForm
          onSubmit={handleAddTask}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          }
        />
      </div>

      <SectionCards tasks={tasks} />

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>View and manage all your tasks in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={tasks} />
        </CardContent>
      </Card>
    </div>
  );
}
