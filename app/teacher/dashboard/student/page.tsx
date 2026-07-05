"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  kidvision_id: string | null;
  class_code: string;
}

export default function StudentRosterPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/get-students");
        const data = await res.json();
        setStudents(data.students || []);
        setFiltered(data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // Search filter
  useEffect(() => {
    const q = search.toLowerCase();
    const results = students.filter((s) =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q),
    );
    setFiltered(results);
  }, [search, students]);

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            textShadow: "0 0 30px rgba(236, 72, 153, 0.6)",
          }}>
            👥 Student Roster
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.7)",
          }}>
            View all students and manage their progress
          </p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/teacher/dashboard/student/pins")}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              background: "rgba(139, 92, 246, 0.1)",
              backdropFilter: "blur(10px)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.8)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🔑 View PINs
          </button>
          
          <button
            onClick={() => router.push("/teacher/dashboard/student/add")}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.4)";
            }}
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        marginBottom: "40px",
        maxWidth: "600px",
      }}>
        <input
          type="text"
          placeholder="🔍 Search students by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 24px",
            fontSize: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "white",
            outline: "none",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: "center",
          padding: "60px",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "18px",
        }}>
          Loading students...
        </div>
      )}

      {/* Student Grid */}
      {!loading && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {filtered.map((student, index) => {
            const initials = `${student.first_name[0] ?? ""}${student.last_name[0] ?? ""}`;
            
            return (
              <div
                key={student.student_id}
                onClick={() => router.push(`/teacher/dashboard/student/${student.student_id}`)}
                style={{
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "30px",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(236, 72, 153, 0.4)";
                  e.currentTarget.style.background = "rgba(236, 72, 153, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "20px",
                  boxShadow: "0 8px 24px rgba(236, 72, 153, 0.4)",
                }}>
                  {initials}
                </div>

                {/* Student Name */}
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "8px",
                }}>
                  {student.first_name} {student.last_name}
                </h3>

                {/* Details */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                  <div style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    <span style={{ fontWeight: "600", color: "#93c5fd" }}>Class:</span> {student.class_code}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    <span style={{ fontWeight: "600", color: "#f9a8d4" }}>ID:</span> {student.kidvision_id || "—"}
                  </div>
                </div>

                {/* Action Hint */}
                <div style={{
                  marginTop: "20px",
                  padding: "10px 16px",
                  background: "rgba(236, 72, 153, 0.15)",
                  border: "1px solid rgba(236, 72, 153, 0.3)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#fda4af",
                  textAlign: "center",
                  fontWeight: "600",
                }}>
                  Click to view details & add comments
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
        }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "20px",
          }}>
            🔍
          </div>
          <h3 style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "12px",
          }}>
            No students found
          </h3>
          <p style={{
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.6)",
          }}>
            {search ? "Try a different search term" : "No students in the roster yet"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
