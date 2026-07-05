import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Roster creation is disabled in this district review build. Student data should remain in district-controlled OneDrive or local review files.",
    },
    { status: 503 }
  );
}