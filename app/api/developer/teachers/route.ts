import { NextResponse } from "next/server";

const disabled = {
  error: "Teacher approval tools are disabled in this district review build.",
};

export async function GET() {
  return NextResponse.json({ teachers: [], ...disabled }, { status: 503 });
}

export async function POST() {
  return NextResponse.json(disabled, { status: 503 });
}

export async function DELETE() {
  return NextResponse.json(disabled, { status: 503 });
}