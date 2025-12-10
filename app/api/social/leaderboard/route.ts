import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const leaderboard = getLeaderboard();

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

