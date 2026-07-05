"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  class_code: string;
  student_pin: string;
}

export default function StudentPinsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedStudents, setGroupedStudents] = useState<{ [key: string]: Student[] }>({});

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/get-students");
        const data = await res.json();
        const studentData = data.students || [];
        setStudents(studentData);

        // Group by class code
        const grouped = studentData.reduce((acc: any, student: Student) => {
          const code = student.class_code || "No Class";
          if (!acc[code]) acc[code] = [];
          acc[code].push(student);
          return acc;
        }, {});
        setGroupedStudents(grouped);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen View - with navigation */}
      <div className="no-print" style={{ minHeight: "100vh", padding: "40px 20px" }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            color: "white",
            padding: "12px 24px",
            fontSize: "18px",
            cursor: "pointer",
            marginBottom: "30px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
        >
          ← Back to Roster
        </button>

        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1 style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            textShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
          }}>
            🔑 Student PINs
          </h1>
          <p style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "30px",
          }}>
            View and print all student login credentials
          </p>
          
          {/* Print Button */}
          <button
            onClick={handlePrint}
            style={{
              padding: "20px 40px",
              fontSize: "24px",
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
            🖨️ Print Student PINs
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "white", fontSize: "28px", padding: "60px" }}>
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            color: "white", 
            fontSize: "28px", 
            padding: "60px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
          }}>
            No students found. Add students first!
          </div>
        ) : (
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {Object.keys(groupedStudents).map((classCode) => (
              <div
                key={classCode}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "24px",
                  padding: "40px",
                  marginBottom: "30px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
              >
                <h2 style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#8b5cf6",
                  marginBottom: "30px",
                  textAlign: "center",
                }}>
                  Class: {classCode}
                </h2>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.5fr",
                  gap: "20px",
                  padding: "24px",
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "#8b5cf6" }}>
                    Student Name
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "#8b5cf6" }}>
                    Student ID
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "#8b5cf6" }}>
                    PIN
                  </div>
                </div>

                {groupedStudents[classCode].map((student, index) => (
                  <div
                    key={student.student_id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1.5fr",
                      gap: "20px",
                      padding: "24px",
                      background: index % 2 === 0 ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)",
                      borderRadius: "8px",
                      borderBottom: index < groupedStudents[classCode].length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                    }}
                  >
                    <div style={{ fontSize: "24px", color: "white", fontWeight: "600" }}>
                      {student.first_name} {student.last_name}
                    </div>
                    <div style={{ fontSize: "22px", color: "rgba(255, 255, 255, 0.9)", fontFamily: "monospace" }}>
                      {student.student_id}
                    </div>
                    <div style={{ 
                      fontSize: "32px", 
                      color: "#ec4899", 
                      fontWeight: "bold", 
                      fontFamily: "monospace",
                      letterSpacing: "4px",
                    }}>
                      {student.student_pin || "NO PIN"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print View - clean and simple */}
      <div className="print-only" style={{ display: "none" }}>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; }
          }
        `}</style>

        <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#000", marginBottom: "10px", textAlign: "center" }}>
            KidVision Student Login Credentials
          </h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px", textAlign: "center" }}>
            Printed: {new Date().toLocaleDateString()}
          </p>

          {Object.keys(groupedStudents).map((classCode) => (
            <div key={classCode} style={{ marginBottom: "50px", pageBreakInside: "avoid" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#000", marginBottom: "20px", borderBottom: "3px solid #8b5cf6", paddingBottom: "10px" }}>
                Class Code: {classCode}
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", border: "1px solid #ddd" }}>
                      Student Name
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", border: "1px solid #ddd" }}>
                      Student ID
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", border: "1px solid #ddd" }}>
                      PIN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedStudents[classCode].map((student, index) => (
                    <tr key={student.student_id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ padding: "12px", fontSize: "14px", border: "1px solid #ddd" }}>
                        {student.first_name} {student.last_name}
                      </td>
                      <td style={{ padding: "12px", fontSize: "14px", fontFamily: "monospace", border: "1px solid #ddd" }}>
                        {student.student_id}
                      </td>
                      <td style={{ padding: "12px", fontSize: "16px", fontWeight: "bold", fontFamily: "monospace", border: "1px solid #ddd" }}>
                        {student.student_pin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div style={{ marginTop: "50px", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #ddd" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Student Login Instructions:</h3>
            <ol style={{ marginLeft: "20px", fontSize: "14px", lineHeight: "1.8" }}>
              <li>Go to the student login page</li>
              <li>Enter your Class Code</li>
              <li>Enter your 4-digit PIN</li>
              <li>Click "Login" to access your dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
