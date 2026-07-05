import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    habits: [],
    message: "Habit APIs are disabled in this district review build. Use the OneDrive/local review flow.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Habit write APIs are disabled in this district review build.",
    },
    { status: 503 }
  );
}