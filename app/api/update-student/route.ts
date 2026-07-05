import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Student update APIs are disabled in this district review build.",
    },
    { status: 503 }
  );
}