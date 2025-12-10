import { NextRequest, NextResponse } from "next/server";

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

    // Mock nudges
    const nudges = [
      {
        id: "1",
        message: "Great job on your workout yesterday! Keep it up!",
        type: "motivation",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        message: "Time for your daily workout! You've got this!",
        type: "workout",
        timestamp: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      nudges,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

