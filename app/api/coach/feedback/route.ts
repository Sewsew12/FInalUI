import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nudgeId, accepted } = body;

    if (!userId || !nudgeId) {
      return NextResponse.json(
        { success: false, error: "User ID and nudge ID are required" },
        { status: 400 }
      );
    }

    // Mock: In real app, update AI model based on feedback
    return NextResponse.json({
      success: true,
      message: "Feedback recorded",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

