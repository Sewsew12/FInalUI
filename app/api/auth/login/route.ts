import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock authentication - in real app, verify password hash
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Add points to user object for display
    const userWithPoints = {
      ...user,
      points: 1234, // Mock points
    };

    return NextResponse.json({
      success: true,
      user: userWithPoints,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

