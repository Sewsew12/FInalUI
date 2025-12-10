import { NextRequest, NextResponse } from "next/server";
import { addActivity, updateGamificationData, getGamificationData } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, duration, calories, distance, steps, date } = body;

    if (!userId || !type || !duration) {
      return NextResponse.json(
        { success: false, error: "User ID, type, and duration are required" },
        { status: 400 }
      );
    }

    const activity = addActivity({
      userId,
      type,
      duration,
      calories,
      distance,
      steps,
      date: date || new Date().toISOString(),
    });

    // Update gamification
    const current = getGamificationData(userId);
    const gamification = updateGamificationData(userId, {
      xp: (current.xp || 0) + (calories || duration * 10),
      points: (current.points || 0) + (calories || duration * 5),
    });

    return NextResponse.json({
      success: true,
      activity,
      gamification,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

