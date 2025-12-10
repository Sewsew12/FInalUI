import { create } from "zustand";
import { Activity } from "@/lib/mock-data";

interface ActivityState {
  activities: Activity[];
  dailyGoal: {
    steps: number;
    calories: number;
    minutes: number;
  };
  fetchActivities: (userId: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  dailyGoal: {
    steps: 10000,
    calories: 2000,
    minutes: 30,
  },
  fetchActivities: async (userId: string) => {
    try {
      const response = await fetch(`/api/activity/list?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        set({ activities: data.activities });
      }
    } catch (error) {
      console.error("Fetch activities error:", error);
    }
  },
  addActivity: async (activity: Omit<Activity, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      });
      const data = await response.json();
      if (data.success) {
        set({ activities: [...get().activities, data.activity] });
      }
    } catch (error) {
      console.error("Add activity error:", error);
    }
  },
  updateActivity: async (id: string, updates: Partial<Activity>) => {
    try {
      const response = await fetch(`/api/activity/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        set({
          activities: get().activities.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        });
      }
    } catch (error) {
      console.error("Update activity error:", error);
    }
  },
  deleteActivity: async (id: string) => {
    try {
      const response = await fetch(`/api/activity/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        set({ activities: get().activities.filter((a) => a.id !== id) });
      }
    } catch (error) {
      console.error("Delete activity error:", error);
    }
  },
}));

