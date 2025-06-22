import { NextRequest, NextResponse } from "next/server";
import { checkServerSideAuthorization } from "@/lib/secureConfig";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const isAuthorized = checkServerSideAuthorization(username);

    return NextResponse.json({
      isAuthorized,
      username: username.toLowerCase().trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Authorization check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
