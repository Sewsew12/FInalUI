import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Mock workout plan
    const workoutPlan = {
      id: "1",
      exercises: [
        { name: "Push-ups", sets: 3, reps: 12 },
        { name: "Squats", sets: 3, reps: 15 },
        { name: "Plank", sets: 3, duration: 30 },
      ],
      intensity: "medium" as const,
      estimatedCalories: 200,
    };

    return NextResponse.json({
      success: true,
      workoutPlan,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

