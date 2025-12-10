"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Activity, Target, Trophy, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { activities, fetchActivities, dailyGoal } = useActivityStore();
  const { data: gamification, fetchData } = useGamificationStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchActivities(user.id);
      fetchData(user.id);
    }
  }, [isAuthenticated, user, router, fetchActivities, fetchData]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const todayActivities = activities.filter(
    (a) => format(new Date(a.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const todayStats = {
    steps: todayActivities.reduce((sum, a) => sum + (a.steps || 0), 0),
    calories: todayActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
    minutes: todayActivities.reduce((sum, a) => sum + a.duration, 0),
  };

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="gradient-purple-blue rounded-2xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-purple-100">Ready to crush your fitness goals today?</p>
        <div className="mt-6 flex items-center space-x-6">
          <div>
            <div className="text-2xl font-bold">{gamification?.level || 1}</div>
            <div className="text-sm text-purple-100">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{gamification?.xp || 0}</div>
            <div className="text-sm text-purple-100">XP</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{gamification?.points || 0}</div>
            <div className="text-sm text-purple-100">Points</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{todayStats.minutes}</span>
          </div>
          <div className="text-sm text-gray-600">Active Minutes</div>
          <div className="mt-2 text-xs text-gray-500">
            Goal: {dailyGoal.minutes} min
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{todayStats.calories}</span>
          </div>
          <div className="text-sm text-gray-600">Calories Burned</div>
          <div className="mt-2 text-xs text-gray-500">
            Goal: {dailyGoal.calories} cal
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{todayStats.steps}</span>
          </div>
          <div className="text-sm text-gray-600">Steps</div>
          <div className="mt-2 text-xs text-gray-500">
            Goal: {dailyGoal.steps.toLocaleString()} steps
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          href="/activity/log"
          className="inline-flex items-center px-6 py-3 gradient-purple-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Activity
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
          <Link
            href="/activity/history"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View All
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No activities yet. Start logging your workouts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{activity.type}</div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(activity.date), "MMM d, yyyy")} • {activity.duration} min
                  </div>
                </div>
                <div className="text-right">
                  {activity.calories && (
                    <div className="font-semibold text-gray-900">{activity.calories} cal</div>
                  )}
                  {activity.distance && (
                    <div className="text-sm text-gray-600">{activity.distance} km</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

