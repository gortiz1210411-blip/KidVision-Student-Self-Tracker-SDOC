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

export default function StudentRoster() {
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
        setStudents(data.students);
        setFiltered(data.students);
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
    <div style={{
      marginTop: "40px",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    }}>
      {/* Header Section */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
        }}>Student Roster</h2>

        <input
          type="text"
          placeholder="Search students..."
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            outline: "none",
            width: "300px",
            color: "white",
            fontSize: "14px",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      {loading ? (
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>Loading students…</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {filtered.map((s) => {
            const initials = `${s.first_name[0] ?? ""}${s.last_name[0] ?? ""}`;

            return (
              <div
                key={s.student_id}
                onClick={() =>
                  router.push(`/teacher/dashboard/student/${s.student_id}`)
                }
                style={{
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
                  e.currentTarget.style.boxShadow = "0 0 25px rgba(236, 72, 153, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
                }}
              >
                {/* Avatar Circle */}
                <div style={{
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.4)",
                }}>
                  {initials}
                </div>

                {/* Student Name */}
                <h3 style={{
                  marginTop: "16px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                }}>
                  {s.first_name} {s.last_name}
                </h3>

                {/* Class Badge */}
                <div style={{
                  marginTop: "8px",
                  display: "inline-block",
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.2)",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  color: "#93c5fd",
                  fontWeight: "600",
                }}>
                  Class: {s.class_code}
                </div>

                {/* KidVision ID */}
                <div style={{
                  marginTop: "12px",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}>
                  <span style={{
                    fontWeight: "600",
                    color: "#f9a8d4",
                  }}>
                    KidVision ID:
                  </span>{" "}
                  {s.kidvision_id ?? "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
