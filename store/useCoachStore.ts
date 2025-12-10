import { create } from "zustand";

interface Nudge {
  id: string;
  message: string;
  type: "motivation" | "workout" | "recovery";
  timestamp: string;
}

interface WorkoutPlan {
  id: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    duration?: number;
  }[];
  intensity: "low" | "medium" | "high";
  estimatedCalories: number;
}

interface CoachState {
  nudges: Nudge[];
  workoutPlan: WorkoutPlan | null;
  fetchNudges: (userId: string) => Promise<void>;
  generateNudge: (userId: string, context: any) => Promise<Nudge | null>;
  getWorkoutPlan: (userId: string) => Promise<void>;
  provideFeedback: (userId: string, nudgeId: string, accepted: boolean) => Promise<void>;
}

export const useCoachStore = create<CoachState>((set, get) => ({
  nudges: [],
  workoutPlan: null,
  fetchNudges: async (userId: string) => {
    try {
      const response = await fetch(`/api/coach/nudges?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        set({ nudges: data.nudges });
      }
    } catch (error) {
      console.error("Fetch nudges error:", error);
    }
  },
  generateNudge: async (userId: string, context: any) => {
    try {
      const response = await fetch("/api/coach/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, context }),
      });
      const data = await response.json();
      if (data.success && data.nudge) {
        set({ nudges: [data.nudge, ...get().nudges] });
        return data.nudge;
      }
      return null;
    } catch (error) {
      console.error("Generate nudge error:", error);
      return null;
    }
  },
  getWorkoutPlan: async (userId: string) => {
    try {
      const response = await fetch(`/api/coach/workout-plan?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        set({ workoutPlan: data.workoutPlan });
      }
    } catch (error) {
      console.error("Get workout plan error:", error);
    }
  },
  provideFeedback: async (userId: string, nudgeId: string, accepted: boolean) => {
    try {
      const response = await fetch("/api/coach/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, nudgeId, accepted }),
      });
      return response.json();
    } catch (error) {
      console.error("Provide feedback error:", error);
    }
  },
}));

