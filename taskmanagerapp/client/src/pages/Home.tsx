import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Stats from "@/components/dashboard/Stats";
import TaskList from "@/components/tasks/TaskList";
import { useTaskManager, Task, TaskFormData } from "@/hooks/useTaskManagerDB";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const {
    tasks,
    filteredTasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    filterKey,
    setFilterKey,
    categoryFilter,
    setCategoryFilter,
    sortTasks,
    reorderTasks,
    isLoading,
    error
  } = useTaskManager();

  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleOpenTaskForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setOpenTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseTaskForm();
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const getFilterTitle = () => {
    switch (filterKey) {
      case "today":
        return "Today's Tasks";
      case "upcoming":
        return "Upcoming Tasks";
      case "completed":
        return "Completed Tasks";
      default:
        return categoryFilter ? `${categoryFilter} Tasks` : "All Tasks";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNewTask={() => handleOpenTaskForm()} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <p>Error loading tasks. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <Skeleton className="h-8 w-24 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 bg-white rounded-lg shadow">
                      <Skeleton className="h-8 w-16 mb-4" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Sidebar 
              activeFilter={filterKey}
              activeCategory={categoryFilter}
              onFilterChange={setFilterKey}
              onCategoryChange={setCategoryFilter}
              categories={["Work", "Personal", "Study", "Health", "Shopping", "Other"]}
              stats={{
                all: tasks?.length || 0,
                today: stats?.dueToday || 0,
                upcoming: stats?.upcoming || 0,
                completed: stats?.completed || 0
              }}
              categoryStats={stats?.byCategory || {}}
            />
            
            <div className="lg:col-span-3 space-y-6">
              <Stats stats={stats} />
              
              <TaskList
                tasks={filteredTasks}
                viewMode={viewMode}
                onToggleViewMode={setViewMode}
                onEditTask={handleOpenTaskForm}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={toggleTaskComplete}
                onSort={sortTasks}
                onReorder={reorderTasks}
                title={getFilterTitle()}
              />
            </div>
          </div>
        )}
      </main>

      <TaskFormDialog
        open={openTaskForm}
        onOpenChange={setOpenTaskForm}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <DeleteTaskDialog
        open={!!taskToDelete}
        onOpenChange={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
      />
    </div>
  );
}
