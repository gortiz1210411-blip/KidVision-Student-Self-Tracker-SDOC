"use client";

import Link from "next/link";

export default function AssessmentsIndexPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>
        Assessments
      </h1>

      <p style={{ marginBottom: 16 }}>
        Choose an assessment area to view or upload assessments.
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: 8 }}>
          <Link href="/teacher/dashboard/assessments/math" style={{ color: "#0366d6" }}>
            📊 Math assessments
          </Link>
        </li>
        <li style={{ marginBottom: 8 }}>
          <Link href="/teacher/dashboard/assessments/reading" style={{ color: "#0366d6" }}>
            📚 Reading assessments
          </Link>
        </li>
        <li style={{ marginBottom: 8 }}>
          <Link href="/teacher/dashboard/assessments/science" style={{ color: "#0366d6" }}>
            🔬 Science assessments
          </Link>
        </li>
      </ul>
    </div>
  );
}
