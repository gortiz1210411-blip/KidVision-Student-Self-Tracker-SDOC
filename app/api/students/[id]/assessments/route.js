import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    assessments: [],
    message: "This legacy assessment endpoint is disabled in the district review build. Use the OneDrive/local review flow.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "This legacy assessment write endpoint is disabled in the district review build.",
    },
    { status: 503 }
  );
}