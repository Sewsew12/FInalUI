import { NextRequest, NextResponse } from "next/server";
import { getGamificationData } from "@/lib/mock-data";

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

    const gamification = getGamificationData(userId);

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

