import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    students: [],
    message: "Inspection endpoints are disabled in the district review build.",
  });
}