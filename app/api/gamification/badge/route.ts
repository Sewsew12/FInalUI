import { NextRequest, NextResponse } from "next/server";
import { updateGamificationData, getGamificationData } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badgeId } = body;

    if (!userId || !badgeId) {
      return NextResponse.json(
        { success: false, error: "User ID and badge ID are required" },
        { status: 400 }
      );
    }

    const current = getGamificationData(userId);
    if (!current.badges.includes(badgeId)) {
      const gamification = updateGamificationData(userId, {
        badges: [...current.badges, badgeId],
      });

      return NextResponse.json({
        success: true,
        gamification,
      });
    }

    return NextResponse.json({
      success: true,
      gamification: current,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

