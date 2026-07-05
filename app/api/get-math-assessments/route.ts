import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    assessments: [],
    message: "This legacy assessment route is disabled in the district review build. Use the OneDrive/local review flow.",
  });
}