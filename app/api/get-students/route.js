import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    students: [],
    message: "This roster route is disabled in the district review build. Use district-controlled OneDrive or local review files.",
  });
}