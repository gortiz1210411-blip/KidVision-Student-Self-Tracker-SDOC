"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  class_code: string;
}

interface Assessment {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  test_date: string;
  test_type: string;
}

export default function ClassAnalyticsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch students
        const studentsRes = await fetch("/api/get-students");
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);

        // Fetch all assessments
        const assessmentsRes = await fetch("/api/student/assessments");
        const assessmentsData = await assessmentsRes.json();
        setAssessments(assessmentsData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate statistics
  const totalStudents = students.length;
  const totalAssessments = assessments.length;
  
  const classCodes = [...new Set(students.map(s => s.class_code))];
  
  const mathAssessments = assessments.filter(a => a.subject === "math");
  const readingAssessments = assessments.filter(a => a.subject === "reading");
  const scienceAssessments = assessments.filter(a => a.subject === "science");

  const avgMath = mathAssessments.length > 0 
    ? Math.round(mathAssessments.reduce((sum, a) => sum + Number(a.score), 0) / mathAssessments.length) 
    : 0;
  const avgReading = readingAssessments.length > 0 
    ? Math.round(readingAssessments.reduce((sum, a) => sum + Number(a.score), 0) / readingAssessments.length) 
    : 0;
  const avgScience = scienceAssessments.length > 0 
    ? Math.round(scienceAssessments.reduce((sum, a) => sum + Number(a.score), 0) / scienceAssessments.length) 
    : 0;

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
      }}>
        Loading analytics...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "30px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "12px",
          textShadow: "0 0 30px rgba(6, 182, 212, 0.6)",
        }}>
          📈 Class Analytics
        </h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.6)",
        }}>
          Overview of student performance and class statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
        maxWidth: "1000px",
        margin: "0 auto 40px",
      }}>
        {/* Total Students */}
        <div style={{
          background: "rgba(139, 92, 246, 0.15)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>👥</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", color: "#a78bfa" }}>
            {totalStudents}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            Total Students
          </div>
        </div>

        {/* Total Assessments */}
        <div style={{
          background: "rgba(59, 130, 246, 0.15)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>📝</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", color: "#60a5fa" }}>
            {totalAssessments}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            Assessments Entered
          </div>
        </div>

        {/* Classes */}
        <div style={{
          background: "rgba(236, 72, 153, 0.15)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(236, 72, 153, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🏫</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", color: "#f472b6" }}>
            {classCodes.length}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            Class Codes
          </div>
        </div>
      </div>

      {/* Subject Averages */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto 40px",
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "white",
          marginBottom: "30px",
          textAlign: "center",
        }}>
          📊 Average Scores by Subject
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
        }}>
          {/* Math */}
          <div style={{
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📐</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Math
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#22d3ee" }}>
              {mathAssessments.length > 0 ? `${avgMath}%` : "—"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              {mathAssessments.length} assessments
            </div>
          </div>

          {/* Reading */}
          <div style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📚</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Reading
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4ade80" }}>
              {readingAssessments.length > 0 ? `${avgReading}%` : "—"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              {readingAssessments.length} assessments
            </div>
          </div>

          {/* Science */}
          <div style={{
            background: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔬</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Science
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fb923c" }}>
              {scienceAssessments.length > 0 ? `${avgScience}%` : "—"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              {scienceAssessments.length} assessments
            </div>
          </div>
        </div>
      </div>

      {/* Class Breakdown */}
      {classCodes.length > 0 && (
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "white",
            marginBottom: "30px",
            textAlign: "center",
          }}>
            🏫 Students by Class
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
          }}>
            {classCodes.map((code) => {
              const count = students.filter(s => s.class_code === code).length;
              return (
                <div key={code} style={{
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#a78bfa", marginBottom: "4px" }}>
                    {code}
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>
                    {count}
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    students
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalAssessments === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "rgba(255,255,255,0.5)",
          fontSize: "16px",
        }}>
          💡 No assessment data yet. Students will enter their scores from their dashboards.
        </div>
      )}
    </div>
  );
}
