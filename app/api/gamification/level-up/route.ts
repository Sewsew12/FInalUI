import { NextRequest, NextResponse } from "next/server";
import { updateGamificationData, getGamificationData } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const current = getGamificationData(userId);
    const xpForNextLevel = current.level * 1000;
    let levelUp = false;

    if (current.xp >= xpForNextLevel) {
      const newLevel = current.level + 1;
      updateGamificationData(userId, {
        level: newLevel,
      });
      levelUp = true;
    }

    const gamification = getGamificationData(userId);

    return NextResponse.json({
      success: true,
      levelUp,
      gamification,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

