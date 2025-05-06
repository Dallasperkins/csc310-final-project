import { useState, useMemo } from "react";
import { isToday, isUpcoming, calculateCompletionRate, getWeeklyGrowthPercentage } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  userId?: number; // Added for DB compatibility
}

export interface TaskFormData {
  title: string;
  description?: string;
  category: string;
  priority: string;
  dueDate?: string;
}

export function useTaskManager() {
  const [filterKey, setFilterKey] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("dueDate");
  const queryClient = useQueryClient();

  // Fetch tasks from the API
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: () => apiRequest<Task[]>({ endpoint: '/api/tasks' }),
  });
  
  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const dueToday = tasks.filter(task => task.dueDate && isToday(task.dueDate) && !task.completed).length;
    const upcoming = tasks.filter(task => task.dueDate && isUpcoming(task.dueDate) && !task.completed).length;
    const completionRate = calculateCompletionRate(completed, total);
    
    // Mock data for weekly growth
    const weeklyGrowth = getWeeklyGrowthPercentage(total, total - 1);

    // Count tasks by category
    const byCategory: Record<string, number> = {};
    tasks.forEach(task => {
      byCategory[task.category] = (byCategory[task.category] || 0) + 1;
    });

    return {
      total,
      completed,
      dueToday,
      upcoming,
      completionRate,
      weeklyGrowth,
      byCategory
    };
  }, [tasks]);

  // Apply filters and sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(task => task.category === categoryFilter);
    }
    
    // Apply status filter
    switch (filterKey) {
      case "today":
        result = result.filter(task => task.dueDate && isToday(task.dueDate));
        break;
      case "upcoming":
        result = result.filter(task => task.dueDate && isUpcoming(task.dueDate) && !task.completed);
        break;
      case "completed":
        result = result.filter(task => task.completed);
        break;
      // "all" shows everything with category filter applied
    }
    
    // Apply sorting
    result = sortTasksBy(result, sortBy);
    
    return result;
  }, [tasks, filterKey, categoryFilter, sortBy]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: TaskFormData) => 
      apiRequest({
        endpoint: '/api/tasks',
        method: 'POST',
        data: taskData
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: TaskFormData }) =>
      apiRequest({
        endpoint: `/api/tasks/${id}`,
        method: 'PUT',
        data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        endpoint: `/api/tasks/${id}`,
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  // Toggle task completion mutation
  const toggleCompleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        endpoint: `/api/tasks/${id}/toggle-complete`,
        method: 'PATCH'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  const addTask = (taskData: TaskFormData) => {
    createTaskMutation.mutate(taskData);
  };

  const updateTask = (taskId: number, taskData: TaskFormData) => {
    updateTaskMutation.mutate({ id: taskId, data: taskData });
  };

  const deleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  const toggleTaskComplete = (taskId: number) => {
    toggleCompleteMutation.mutate(taskId);
  };

  const sortTasks = (sortByOption: string) => {
    setSortBy(sortByOption);
  };

  const reorderTasks = (draggedId: number, targetId: number) => {
    // For now, just refresh the data as we don't have a direct reordering API
    // This is a placeholder for future implementation of task reordering
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
  };

  return {
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
  };
}

function sortTasksBy(tasks: Task[], sortBy: string): Task[] {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case "dueDate":
      return sorted.sort((a, b) => {
        // Tasks without due dates go to the end
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    
    case "priority":
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => 
        (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
      );
    
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    default:
      return sorted;
  }
}
