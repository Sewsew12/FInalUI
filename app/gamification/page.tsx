"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Trophy, Award, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GamificationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data, fetchData } = useGamificationStore();
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "expired">("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchData(user.id);
    }
  }, [isAuthenticated, user, router, fetchData]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const filteredChallenges =
    filter === "all"
      ? data?.challenges || []
      : data?.challenges.filter((c) => {
          if (filter === "active") return !c.completed;
          if (filter === "completed") return c.completed;
          return false;
        }) || [];

  const xpForNextLevel = (level: number) => level * 1000;
  const currentLevelXP = data ? (data.level - 1) * 1000 : 0;
  const progressXP = data ? data.xp - currentLevelXP : 0;
  const progressPercent = data
    ? (progressXP / (xpForNextLevel(data.level) - currentLevelXP)) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gamification</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-gray-900">{data?.level || 1}</span>
          </div>
          <div className="text-sm text-gray-600">Level</div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>XP Progress</span>
              <span>{progressXP} / {xpForNextLevel(data?.level || 1) - currentLevelXP}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="gradient-purple-blue h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold text-gray-900">{data?.xp || 0}</span>
          </div>
          <div className="text-sm text-gray-600">Total XP</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-blue-500" />
            <span className="text-3xl font-bold text-gray-900">{data?.badges.length || 0}</span>
          </div>
          <div className="text-sm text-gray-600">Badges Earned</div>
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Challenges</h2>
          <div className="flex gap-2">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "gradient-purple-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No challenges available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border-2 ${
                  challenge.completed
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{challenge.name}</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {challenge.progress} / {challenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        challenge.completed
                          ? "bg-green-500"
                          : "gradient-purple-blue"
                      }`}
                      style={{
                        width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                {challenge.completed && (
                  <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      {data && data.badges.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.badges.map((badge, index) => (
              <div
                key={index}
                className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-semibold text-gray-900">{badge}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

