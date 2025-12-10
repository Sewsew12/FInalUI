import { create } from "zustand";
import { LeaderboardEntry, SocialData } from "@/lib/mock-data";

interface SocialState {
  friends: string[];
  teams: { id: string; name: string; members: string[] }[];
  leaderboard: LeaderboardEntry[];
  userRank: number;
  fetchSocialData: (userId: string) => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  addFriend: (userId: string, friendId: string) => Promise<void>;
  sendNudge: (userId: string, friendId: string, message: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  friends: [],
  teams: [],
  leaderboard: [],
  userRank: 0,
  fetchSocialData: async (userId: string) => {
    try {
      const response = await fetch(`/api/social/data?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        set({
          friends: data.friends,
          teams: data.teams,
          userRank: data.rank,
        });
      }
    } catch (error) {
      console.error("Fetch social data error:", error);
    }
  },
  fetchLeaderboard: async () => {
    try {
      const response = await fetch("/api/social/leaderboard");
      const data = await response.json();
      if (data.success) {
        set({ leaderboard: data.leaderboard });
      }
    } catch (error) {
      console.error("Fetch leaderboard error:", error);
    }
  },
  addFriend: async (userId: string, friendId: string) => {
    try {
      const response = await fetch("/api/social/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId }),
      });
      const data = await response.json();
      if (data.success) {
        await get().fetchSocialData(userId);
      }
    } catch (error) {
      console.error("Add friend error:", error);
    }
  },
  sendNudge: async (userId: string, friendId: string, message: string) => {
    try {
      const response = await fetch("/api/social/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId, message }),
      });
      return response.json();
    } catch (error) {
      console.error("Send nudge error:", error);
    }
  },
}));

