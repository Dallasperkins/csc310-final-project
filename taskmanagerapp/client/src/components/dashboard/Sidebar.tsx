import { cn } from "@/lib/utils";
import { 
  ListChecks, 
  CalendarDays, 
  CalendarClock, 
  CheckCircle2 
} from "lucide-react";

type SidebarProps = {
  activeFilter: string;
  activeCategory: string | null;
  onFilterChange: (filter: string) => void;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
  stats: {
    all: number;
    today: number;
    upcoming: number;
    completed: number;
  };
  categoryStats: Record<string, number>;
};

export default function Sidebar({
  activeFilter,
  activeCategory,
  onFilterChange,
  onCategoryChange,
  categories,
  stats,
  categoryStats
}: SidebarProps) {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
        <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              onFilterChange("all");
              onCategoryChange(null);
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-colors duration-200",
              activeFilter === "all" && !activeCategory
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            )}
          >
            <ListChecks className="inline-block mr-3 h-4 w-4" />
            All Tasks
            <span className="float-right bg-gray-200 text-gray-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
              {stats.all}
            </span>
          </button>

          <button
            onClick={() => {
              onFilterChange("today");
              onCategoryChange(null);
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-colors duration-200",
              activeFilter === "today" && !activeCategory
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            )}
          >
            <CalendarDays className="inline-block mr-3 h-4 w-4" />
            Today
            <span className="float-right bg-yellow-200 text-yellow-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
              {stats.today}
            </span>
          </button>

          <button
            onClick={() => {
              onFilterChange("upcoming");
              onCategoryChange(null);
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-colors duration-200",
              activeFilter === "upcoming" && !activeCategory
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            )}
          >
            <CalendarClock className="inline-block mr-3 h-4 w-4" />
            Upcoming
            <span className="float-right bg-blue-200 text-blue-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
              {stats.upcoming}
            </span>
          </button>

          <button
            onClick={() => {
              onFilterChange("completed");
              onCategoryChange(null);
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-colors duration-200",
              activeFilter === "completed" && !activeCategory
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            )}
          >
            <CheckCircle2 className="inline-block mr-3 h-4 w-4" />
            Completed
            <span className="float-right bg-green-200 text-green-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
              {stats.completed}
            </span>
          </button>
        </div>

        <hr className="my-4" />

        <h2 className="font-heading font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const dotColorClass = getCategoryColorClass(category);
            
            return (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  onFilterChange("all");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center",
                  activeCategory === category
                    ? "bg-primary-50 text-primary-700"
                    : "hover:bg-gray-50"
                )}
              >
                <span className={cn("h-3 w-3 rounded-full mr-3", dotColorClass)} />
                {category}
                <span className="ml-auto bg-gray-200 text-gray-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-xs">
                  {categoryStats[category] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function getCategoryColorClass(category: string): string {
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
