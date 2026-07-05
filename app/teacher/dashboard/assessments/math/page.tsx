"use client";

import { useEffect, useState } from "react";

type AssessmentSmall = {
  id?: string;
  test_date?: string;
  test_type?: string;
  assessment_name?: string;
  score?: number | string | null;
  student_id?: string;
};

export default function MathAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentSmall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/get-math-assessments");
        const json = await res.json();

        if (json.error) {
          setError(json.error);
          console.error("Load error:", json.error);
        } else {
          setAssessments(json.data || json || []);
          setError(null);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        console.error(err);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: "18px",
      }}>
        <p>Loading math assessments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "30px",
          background: "rgba(239, 68, 68, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "16px",
          color: "#fca5a5",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>⚠️ Error loading assessments</h2>
        <p>{error}</p>
        <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.8 }}>
          Check that your Storage credentials are set in .env.local
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "36px", 
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        }}>
          📊 Math Assessments
        </h1>
        <p style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "16px",
          marginTop: "8px",
        }}>
          Student-entered assessment data
        </p>
      </div>

      {assessments.length === 0 && (
        <div style={{
          padding: "60px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "18px",
        }}>
          No math assessments found.
        </div>
      )}

      {assessments.length > 0 && (
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          overflowX: "auto",
        }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th style={{ 
                  padding: "16px", 
                  textAlign: "left",
                  color: "rgba(224, 231, 255, 0.9)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                }}>Date</th>
                <th style={{ 
                  padding: "16px", 
                  textAlign: "left",
                  color: "rgba(224, 231, 255, 0.9)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                }}>Student</th>
                <th style={{ 
                  padding: "16px", 
                  textAlign: "left",
                  color: "rgba(224, 231, 255, 0.9)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                }}>Test Type</th>
                <th style={{ 
                  padding: "16px", 
                  textAlign: "left",
                  color: "rgba(224, 231, 255, 0.9)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                }}>
                  Assessment Name
                </th>
                <th style={{ 
                  padding: "16px", 
                  textAlign: "left",
                  color: "rgba(224, 231, 255, 0.9)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  borderBottom: "2px solid rgba(59, 130, 246, 0.3)",
                }}>
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {assessments.map((a, i) => (
                <tr
                  key={a.id || i}
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ 
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}>
                    {a.test_date || "-"}
                  </td>
                  <td style={{ 
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}>
                    {a.student_id || "-"}
                  </td>
                  <td style={{ 
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}>
                    {a.test_type || "-"}
                  </td>
                  <td style={{ 
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}>
                    {a.assessment_name || "-"}
                  </td>
                  <td style={{ 
                    padding: "16px",
                    color: "rgba(255, 255, 255, 0.9)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    fontWeight: "600",
                  }}>
                    {a.score ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

