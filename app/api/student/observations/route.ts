import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    observations: [],
    message: "Observation APIs are disabled in this district review build. Use the OneDrive/local review flow.",
  });
}