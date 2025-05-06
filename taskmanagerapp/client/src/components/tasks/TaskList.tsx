import { useState } from "react";
import { ChevronDown, List, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  viewMode: "list" | "grid";
  onToggleViewMode: (mode: "list" | "grid") => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onToggleComplete: (id: number) => void;
  onSort: (sortBy: string) => void;
  onReorder: (draggedId: number, targetId: number) => void;
  title: string;
};

export default function TaskList({
  tasks,
  viewMode,
  onToggleViewMode,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onSort,
  onReorder,
  title
}: TaskListProps) {
  const [sortOption, setSortOption] = useState("dueDate");

  const handleSort = (value: string) => {
    setSortOption(value);
    onSort(value);
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold text-lg">{title}</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Select value={sortOption} onValueChange={handleSort}>
              <SelectTrigger className="h-9 w-auto text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <SelectValue placeholder="Sort by Due Date" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center bg-gray-50 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-2 rounded-l-md",
                viewMode === "list"
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:text-gray-800"
              )}
              onClick={() => onToggleViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-2 rounded-r-md",
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:text-gray-800"
              )}
              onClick={() => onToggleViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <List className="text-gray-400 h-10 w-10" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 mb-4">There are no tasks matching your current filters.</p>
          <Button onClick={() => onToggleViewMode("list")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add a new task
          </Button>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  viewMode="list"
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task)}
                  onToggleComplete={() => onToggleComplete(task.id)}
                  onReorder={onReorder}
                />
              ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  viewMode="grid"
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task)}
                  onToggleComplete={() => onToggleComplete(task.id)}
                  onReorder={onReorder}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
