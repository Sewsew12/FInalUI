import { create } from "zustand";
import { GamificationData } from "@/lib/mock-data";

interface GamificationState {
  data: GamificationData | null;
  fetchData: (userId: string) => Promise<void>;
  updateXP: (userId: string, xp: number) => Promise<void>;
  checkLevelUp: (userId: string) => Promise<boolean>;
  unlockBadge: (userId: string, badgeId: string) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  data: null,
  fetchData: async (userId: string) => {
    try {
      const response = await fetch(`/api/gamification/status?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        set({ data: data.gamification });
      }
    } catch (error) {
      console.error("Fetch gamification error:", error);
    }
  },
  updateXP: async (userId: string, xp: number) => {
    try {
      const response = await fetch("/api/gamification/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, xp }),
      });
      const data = await response.json();
      if (data.success) {
        set({ data: data.gamification });
      }
    } catch (error) {
      console.error("Update XP error:", error);
    }
  },
  checkLevelUp: async (userId: string) => {
    try {
      const response = await fetch("/api/gamification/level-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success && data.levelUp) {
        set({ data: data.gamification });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Check level up error:", error);
      return false;
    }
  },
  unlockBadge: async (userId: string, badgeId: string) => {
    try {
      const response = await fetch("/api/gamification/badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, badgeId }),
      });
      const data = await response.json();
      if (data.success) {
        set({ data: data.gamification });
      }
    } catch (error) {
      console.error("Unlock badge error:", error);
    }
  },
}));

