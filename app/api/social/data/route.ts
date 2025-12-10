import { NextRequest, NextResponse } from "next/server";
import { getSocialData, getLeaderboard } from "@/lib/mock-data";

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

    const social = getSocialData(userId);
    const leaderboard = getLeaderboard();
    const userRank = leaderboard.findIndex((e) => e.userId === userId) + 1;

    return NextResponse.json({
      success: true,
      friends: social.friends,
      teams: social.teams,
      rank: userRank || leaderboard.length + 1,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

