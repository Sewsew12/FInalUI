import { NextRequest, NextResponse } from "next/server";
import { updateSocialData, getSocialData } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      return NextResponse.json(
        { success: false, error: "User ID and friend ID are required" },
        { status: 400 }
      );
    }

    const current = getSocialData(userId);
    if (!current.friends.includes(friendId)) {
      const social = updateSocialData(userId, {
        friends: [...current.friends, friendId],
      });

      return NextResponse.json({
        success: true,
        social,
      });
    }

    return NextResponse.json({
      success: true,
      social: current,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

