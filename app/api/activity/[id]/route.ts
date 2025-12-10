import { NextRequest, NextResponse } from "next/server";
import { mockData } from "@/lib/mock-data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const activity = mockData.activities.find((a) => a.id === params.id);

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    Object.assign(activity, updates);

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = mockData.activities.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    mockData.activities.splice(index, 1);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

