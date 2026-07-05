import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// GET assessments for a student
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentIdParam = searchParams.get("student_id");
    const subject = searchParams.get("subject"); // 'math', 'reading', 'science'

    if (!studentIdParam || !subject) {
      return NextResponse.json(
        { error: "Missing required parameters: student_id and subject" },
        { status: 400 }
      );
    }

    // Read from local JSON file
    const dataPath = path.join(process.cwd(), "public", "data", "student_assessments.json");
    const file = await fs.readFile(dataPath, "utf-8");
    const allAssessments = JSON.parse(file);
    // Filter by student_id and subject (case-insensitive)
    const filtered = allAssessments.filter((a: any) =>
      (a.student_id === studentIdParam) &&
      (!a.subject || a.subject.toLowerCase() === subject.toLowerCase() || (subject === "math" && !a.subject))
    );
    // Add is_scale_score and max_score for compatibility
    const SCALE_SCORE_TESTS = ["STAR", "FAST Progress Monitoring", "Quarterly Progress Monitoring"];
    const transformedData = filtered.map((item: any) => {
      const isScaleScore = SCALE_SCORE_TESTS.includes(item.assessment_type);
      return {
        ...item,
        max_score: isScaleScore ? 999 : item.max_score ?? 100,
        is_scale_score: isScaleScore,
      };
    });
    return NextResponse.json({ assessments: transformedData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


// POST new assessment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      student_id,
      subject,
      assessment_type,
      test_name,
      score,
      max_score,
      date_given,
    } = body;

    if (!student_id || !assessment_type || score === undefined || !date_given) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), "public", "data", "student_assessments.json");
    const file = await fs.readFile(dataPath, "utf-8");
    const allAssessments = JSON.parse(file);

    // Generate a new id
    const newId = (allAssessments.length > 0 ? (parseInt(allAssessments[allAssessments.length - 1].id) + 1).toString() : "1");
    const newAssessment = {
      id: newId,
      student_id,
      subject,
      assessment_type,
      test_name: test_name || assessment_type,
      score: parseFloat(score),
      max_score: max_score ?? 100,
      date_given,
    };
    allAssessments.push(newAssessment);
    await fs.writeFile(dataPath, JSON.stringify(allAssessments, null, 2));
    return NextResponse.json({ assessment: newAssessment });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Assessment id is required" },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), "public", "data", "student_assessments.json");
    const file = await fs.readFile(dataPath, "utf-8");
    let allAssessments = JSON.parse(file);
    const initialLength = allAssessments.length;
    allAssessments = allAssessments.filter((a: any) => a.id !== id);
    if (allAssessments.length === initialLength) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }
    await fs.writeFile(dataPath, JSON.stringify(allAssessments, null, 2));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
