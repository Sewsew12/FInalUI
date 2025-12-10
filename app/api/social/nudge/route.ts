import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, friendId, message } = body;

    if (!userId || !friendId || !message) {
      return NextResponse.json(
        { success: false, error: "User ID, friend ID, and message are required" },
        { status: 400 }
      );
    }

    // Mock: In real app, send notification to friend
    return NextResponse.json({
      success: true,
      message: "Nudge sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

