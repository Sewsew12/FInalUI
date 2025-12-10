"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocialStore } from "@/store/useSocialStore";
import { Trophy, Medal, Award, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { leaderboard, fetchLeaderboard, userRank } = useSocialStore();
  const [scope, setScope] = useState<"global" | "friends" | "groups">("global");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("alltime");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchLeaderboard();
  }, [isAuthenticated, router, fetchLeaderboard]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="text-gray-500 font-semibold">#{rank}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
            <div className="flex gap-2">
              {(["global", "friends", "groups"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scope === s
                      ? "gradient-purple-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <div className="flex gap-2">
              {(["weekly", "monthly", "alltime"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? "gradient-purple-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p === "alltime" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.slice(0, 20).map((entry, index) => {
                const isCurrentUser = entry.userId === user.id;
                return (
                  <tr
                    key={entry.userId}
                    className={isCurrentUser ? "bg-purple-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-semibold">
                            {entry.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.userName}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-purple-600">(You)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {entry.score.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-gray-400 mr-1" />
                        )}
                        <span className="text-sm text-gray-600">--</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {userRank > 20 && (
        <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Your Rank</div>
              <div className="text-2xl font-bold text-purple-600">#{userRank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Your Score</div>
              <div className="text-2xl font-bold text-purple-600">
                {leaderboard.find((e) => e.userId === user.id)?.score.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

