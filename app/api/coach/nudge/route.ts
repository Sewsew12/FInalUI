import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, context } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Mock AI-generated nudge
    const nudge = {
      id: Date.now().toString(),
      message: "You're doing amazing! Keep pushing towards your goals!",
      type: "motivation",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      nudge,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

