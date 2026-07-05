import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    students: [],
    message: "This student roster endpoint is disabled in the district review build. Use the OneDrive/local review flow.",
  });
}