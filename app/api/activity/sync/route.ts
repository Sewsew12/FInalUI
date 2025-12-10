import { NextRequest, NextResponse } from "next/server";
import { addActivity } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activities } = body;

    if (!userId || !activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { success: false, error: "User ID and activities array are required" },
        { status: 400 }
      );
    }

    const syncedActivities = activities.map((activity: any) =>
      addActivity({
        userId,
        type: activity.type || "Synced Activity",
        duration: activity.duration || 0,
        calories: activity.calories,
        distance: activity.distance,
        steps: activity.steps,
        heartRate: activity.heartRate,
        date: activity.date || new Date().toISOString(),
      })
    );

    return NextResponse.json({
      success: true,
      activities: syncedActivities,
      count: syncedActivities.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

