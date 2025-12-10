"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { format } from "date-fns";
import { Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ActivityHistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { activities, fetchActivities, deleteActivity } = useActivityStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchActivities(user.id);
    }
  }, [isAuthenticated, user, router, fetchActivities]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalStats = {
    activities: activities.length,
    totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
    totalMinutes: activities.reduce((sum, a) => sum + a.duration, 0),
  };

  const activityTypes = Array.from(new Set(activities.map((a) => a.type)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Activity History</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{totalStats.activities}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalCalories}</div>
          <div className="text-sm text-gray-600">Total Calories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalMinutes}</div>
          <div className="text-sm text-gray-600">Total Minutes</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="all">All Types</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No activities found.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{activity.type}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(activity.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-gray-600">
                      Duration: <span className="font-semibold">{activity.duration} min</span>
                    </span>
                    {activity.calories && (
                      <span className="text-sm text-gray-600">
                        Calories: <span className="font-semibold">{activity.calories}</span>
                      </span>
                    )}
                    {activity.distance && (
                      <span className="text-sm text-gray-600">
                        Distance: <span className="font-semibold">{activity.distance} km</span>
                      </span>
                    )}
                    {activity.steps && (
                      <span className="text-sm text-gray-600">
                        Steps: <span className="font-semibold">{activity.steps}</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

