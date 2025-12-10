import { NextRequest, NextResponse } from "next/server";
import { updateGamificationData, getGamificationData } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, xp, points } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const current = getGamificationData(userId);
    const gamification = updateGamificationData(userId, {
      xp: (current.xp || 0) + (xp || 0),
      points: (current.points || 0) + (points || 0),
    });

    return NextResponse.json({
      success: true,
      gamification,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

