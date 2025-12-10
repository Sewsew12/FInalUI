import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, age, weight, height, goals, preferences } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (getUserByEmail(email)) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const user = createUser({
      email,
      password, // In real app, hash this
      name,
      age,
      weight,
      height,
      goals: goals || [],
      preferences: preferences || {
        activityTypes: [],
        notifications: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

