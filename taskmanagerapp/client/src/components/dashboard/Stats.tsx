import { CheckCircle2, ListChecks, Clock } from "lucide-react";

type StatsProps = {
  stats: {
    total: number;
    completed: number;
    dueToday: number;
    completionRate: number;
    weeklyGrowth: number;
  };
};

export default function Stats({ stats }: StatsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <div className="bg-primary-100 rounded-full p-3">
            <ListChecks className="text-primary-600 h-5 w-5" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Tasks</h3>
            <p className="text-2xl font-semibold">{stats.total}</p>
            <div className="text-xs text-green-600">
              <span className="inline-block mr-1">↑</span> {stats.weeklyGrowth}% from last week
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle2 className="text-green-600 h-5 w-5" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Completed</h3>
            <p className="text-2xl font-semibold">{stats.completed}</p>
            <div className="flex items-center text-xs">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <span>{stats.completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <div className="bg-yellow-100 rounded-full p-3">
            <Clock className="text-yellow-600 h-5 w-5" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Due Today</h3>
            <p className="text-2xl font-semibold">{stats.dueToday}</p>
            {stats.dueToday > 0 && (
              <div className="text-xs text-yellow-600">
                <span className="inline-block mr-1">⚠</span> Requires attention
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
