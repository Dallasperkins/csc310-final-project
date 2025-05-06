import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Flag, CalendarDays, Clock, CheckCircle } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useDrag, useDrop } from "react-dnd";

type TaskItemProps = {
  task: Task;
  viewMode: "list" | "grid";
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onReorder: (draggedId: number, targetId: number) => void;
};

export default function TaskItem({
  task,
  viewMode,
  onEdit,
  onDelete,
  onToggleComplete,
  onReorder
}: TaskItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: number }) => {
      onReorder(item.id, task.id);
    },
  }));

  const categoryBorderClass = getCategoryBorderClass(task.category);
  const priorityClass = getPriorityClass(task.priority);
  const dueDateInfo = getDueDateInfo(task.dueDate);

  if (viewMode === "list") {
    return (
      <div 
        ref={(node) => drag(drop(node))}
        className={cn(
          "task-item border-l-4 bg-white rounded-md shadow-sm p-4 flex flex-wrap md:flex-nowrap items-center gap-4 transition-all duration-200",
          categoryBorderClass,
          task.completed && "opacity-60",
          isDragging && "opacity-50"
        )}
        style={{ cursor: "move" }}
      >
        <div className="flex-shrink-0">
          <Checkbox 
            id={`task-${task.id}`} 
            checked={task.completed}
            onCheckedChange={onToggleComplete}
            className="h-5 w-5 text-primary-600 rounded cursor-pointer focus:ring-primary-500"
          />
        </div>

        <div className="flex-grow">
          <h3 
            className={cn(
              "font-medium text-gray-900", 
              task.completed && "line-through"
            )}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <div className="text-sm text-gray-500 mt-1">
              {task.description}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={getCategoryBadgeClass(task.category)}>
              <span className={`w-2 h-2 rounded-full ${getCategoryDotClass(task.category)} mr-1`}></span>
              {task.category}
            </span>
            
            {task.priority !== "low" && (
              <span className={priorityClass}>
                <Flag className="h-3 w-3 mr-1" />
                {capitalize(task.priority)} Priority
              </span>
            )}
            
            {task.dueDate && (
              <span className={dueDateInfo.className}>
                <CalendarDays className="h-3 w-3 mr-1" />
                {dueDateInfo.text}
              </span>
            )}

            {task.completed && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-gray-400 hover:text-primary-600 transition-colors duration-200 h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-600 transition-colors duration-200 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      ref={(node) => drag(drop(node))}
      className={cn(
        "task-item border-t-4 bg-white rounded-md shadow-sm p-4 flex flex-col transition-all duration-200",
        categoryBorderClass.replace("border-l-4", "border-t-4"),
        task.completed && "opacity-60",
        isDragging && "opacity-50"
      )}
      style={{ cursor: "move" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Checkbox
            id={`task-grid-${task.id}`}
            checked={task.completed}
            onCheckedChange={onToggleComplete}
            className="h-5 w-5 text-primary-600 rounded cursor-pointer focus:ring-primary-500 mr-3"
          />
          <h3
            className={cn(
              "font-medium text-gray-900",
              task.completed && "line-through"
            )}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-gray-400 hover:text-primary-600 transition-colors duration-200 h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-600 transition-colors duration-200 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-4">{task.description}</p>
      )}

      <div className="mt-auto">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={getCategoryBadgeClass(task.category)}>
            <span className={`w-2 h-2 rounded-full ${getCategoryDotClass(task.category)} mr-1`}></span>
            {task.category}
          </span>
          
          {task.priority !== "low" && (
            <span className={priorityClass}>
              <Flag className="h-3 w-3 mr-1" />
              {capitalize(task.priority)} Priority
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1 inline" />
            Created {formatRelativeTime(new Date(task.createdAt))}
          </span>
          
          {task.dueDate && !task.completed ? (
            <span className={dueDateInfo.className}>
              <CalendarDays className="h-3 w-3 mr-1" />
              {dueDateInfo.text}
            </span>
          ) : task.completed ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              Completed
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getCategoryBorderClass(category: string): string {
  switch (category.toLowerCase()) {
    case "work":
      return "border-blue-500";
    case "personal":
      return "border-purple-500";
    case "study":
      return "border-green-500";
    case "health":
      return "border-red-500";
    case "shopping":
      return "border-yellow-500";
    default:
      return "border-gray-500";
  }
}

function getCategoryBadgeClass(category: string): string {
  switch (category.toLowerCase()) {
    case "work":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
    case "personal":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800";
    case "study":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
    case "health":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
    case "shopping":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
  }
}

function getCategoryDotClass(category: string): string {
  switch (category.toLowerCase()) {
    case "work":
      return "bg-blue-500";
    case "personal":
      return "bg-purple-500";
    case "study":
      return "bg-green-500";
    case "health":
      return "bg-red-500";
    case "shopping":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

function getPriorityClass(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
    case "medium":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
  }
}

function getDueDateInfo(dueDate: string | null) {
  if (!dueDate) return { text: "", className: "" };

  const now = new Date();
  const dueDateTime = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDay = new Date(dueDateTime.getFullYear(), dueDateTime.getMonth(), dueDateTime.getDate());

  if (dueDay.getTime() === today.getTime()) {
    return {
      text: "Due today",
      className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
    };
  } else if (dueDay < today) {
    return {
      text: "Overdue",
      className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
    };
  } else if (dueDay.getTime() === tomorrow.getTime()) {
    return {
      text: "Due tomorrow",
      className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
    };
  }

  const diffTime = Math.abs(dueDay.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    return {
      text: `Due in ${diffDays} days`,
      className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
    };
  }

  return {
    text: `Due in ${diffDays} days`,
    className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
