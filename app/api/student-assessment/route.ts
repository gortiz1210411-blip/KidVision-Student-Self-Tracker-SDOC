import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Assessment write APIs are disabled in this district review build. Use the OneDrive/local review flow.",
    },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json({
    assessments: [],
    message: "Assessment read APIs are disabled in this district review build. Use the OneDrive/local review flow.",
  });
}