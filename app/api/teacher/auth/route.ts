import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Teacher authentication is disabled in this district review build.",
    },
    { status: 503 }
  );
}