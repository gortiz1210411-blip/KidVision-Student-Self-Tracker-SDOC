"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StudentRow {
  id: number;
  firstName: string;
  lastName: string;
  previewId: string;
}

export default function AddStudentPage() {
  const router = useRouter();
  const [classCode, setClassCode] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([
    { id: 1, firstName: "", lastName: "", previewId: "" },
    { id: 2, firstName: "", lastName: "", previewId: "" },
    { id: 3, firstName: "", lastName: "", previewId: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedStudents, setAddedStudents] = useState<any[]>([]);

  // Generate preview of student ID (max 8 characters)
  const generateStudentId = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return "";
    const firstPart = firstName.slice(0, 4).toUpperCase();
    const lastPart = lastName.slice(0, 3).toUpperCase();
    return `${firstPart}${lastPart}`;
  };

  const updateStudent = (id: number, field: "firstName" | "lastName", value: string) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        // Limit last name to 3 characters
        const newValue = field === "lastName" ? value.slice(0, 3).toUpperCase() : value;
        const updated = { ...s, [field]: newValue };
        updated.previewId = generateStudentId(updated.firstName, updated.lastName);
        return updated;
      }
      return s;
    }));
  };

  const addRow = () => {
    const newId = Math.max(...students.map(s => s.id)) + 1;
    setStudents([...students, { id: newId, firstName: "", lastName: "", previewId: "" }]);
  };

  const removeRow = (id: number) => {
    if (students.length > 1) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    // Filter out empty rows
    const validStudents = students.filter(s => s.firstName.trim() && s.lastName.trim());
    
    if (validStudents.length === 0) {
      setError("Please add at least one student");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setAddedStudents([]);

    try {
      const res = await fetch("/api/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: validStudents.map(s => ({
            firstName: s.firstName.trim(),
            lastName: s.lastName.trim(),
          })),
          classCode: classCode.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add students");
        return;
      }

      setAddedStudents(data.students);
      setMessage(`✅ Successfully added ${data.students.length} student(s)!`);
      
      // Reset form after showing results
      setTimeout(() => {
        setStudents([
          { id: 1, firstName: "", lastName: "", previewId: "" },
          { id: 2, firstName: "", lastName: "", previewId: "" },
          { id: 3, firstName: "", lastName: "", previewId: "" },
        ]);
        setAddedStudents([]);
        setMessage("");
      }, 10000);

    } catch (err) {
      setError("Error adding students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          fontSize: "56px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "16px",
          textShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
        }}>
          ➕ Add Students
        </h1>
        <p style={{
          fontSize: "22px",
          color: "rgba(255, 255, 255, 0.7)",
        }}>
          Add multiple students at once to your class
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        <form onSubmit={handleSubmit}>
          {/* Class Code */}
          <div style={{ marginBottom: "40px" }}>
            <label style={{
              display: "block",
              fontSize: "26px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "12px",
            }}>
              Class Code (for all students)
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="e.g., SMITH2025"
              style={{
                maxWidth: "400px",
                padding: "18px 24px",
                fontSize: "24px",
                fontWeight: "bold",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Student List Table */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px",
            }}>
              <label style={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "white",
              }}>
                Students
              </label>
              <button
                type="button"
                onClick={addRow}
                style={{
                  padding: "12px 24px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  border: "1px solid rgba(139, 92, 246, 0.5)",
                  background: "rgba(139, 92, 246, 0.2)",
                  color: "#8b5cf6",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
                }}
              >
                + Add Row
              </button>
            </div>

            {/* Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.2fr 60px",
              gap: "16px",
              padding: "16px",
              background: "rgba(139, 92, 246, 0.1)",
              borderRadius: "12px 12px 0 0",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5cf6" }}>
                First Name
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5cf6" }}>
                Last Name (3 letters)
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5cf6" }}>
                Student ID Preview
              </div>
              <div></div>
            </div>

            {/* Table Rows */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "0 0 12px 12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxHeight: "500px",
              overflowY: "auto",
            }}>
              {students.map((student, index) => (
                <div
                  key={student.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1.2fr 60px",
                    gap: "16px",
                    padding: "16px",
                    borderBottom: index < students.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                  }}
                >
                  <input
                    type="text"
                    value={student.firstName}
                    onChange={(e) => updateStudent(student.id, "firstName", e.target.value)}
                    placeholder="First name"
                    style={{
                      padding: "14px 18px",
                      fontSize: "18px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={student.lastName}
                    onChange={(e) => updateStudent(student.id, "lastName", e.target.value)}
                    placeholder="3 letters"
                    maxLength={3}
                    style={{
                      padding: "14px 18px",
                      fontSize: "18px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      outline: "none",
                      textTransform: "uppercase",
                    }}
                  />
                  <div style={{
                    padding: "14px 18px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: student.previewId ? "#8b5cf6" : "rgba(255, 255, 255, 0.3)",
                    fontFamily: "monospace",
                  }}>
                    {student.previewId || "—"}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(student.id)}
                    disabled={students.length === 1}
                    style={{
                      padding: "8px",
                      fontSize: "18px",
                      borderRadius: "8px",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: students.length === 1 ? "rgba(255, 255, 255, 0.2)" : "#f87171",
                      cursor: students.length === 1 ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (students.length > 1) {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Success Message with PINs */}
          {addedStudents.length > 0 && (
            <div style={{
              marginBottom: "30px",
              padding: "24px",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              borderRadius: "12px",
            }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#4ade80",
                marginBottom: "16px",
              }}>
                ✅ Students Added Successfully! 
              </h3>
              <p style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "16px",
              }}>
                Save these PINs for your students:
              </p>
              <div style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                maxHeight: "200px",
                overflowY: "auto",
              }}>
                {addedStudents.map((s, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i < addedStudents.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                  }}>
                    <span style={{ color: "white", fontSize: "16px" }}>
                      {s.first_name} {s.last_name}
                    </span>
                    <span style={{ color: "#8b5cf6", fontWeight: "bold", fontSize: "16px", fontFamily: "monospace" }}>
                      PIN: {s.student_pin}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {message && !addedStudents.length && (
            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              borderRadius: "12px",
              color: "#4ade80",
              fontSize: "16px",
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              color: "#f87171",
              fontSize: "16px",
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !classCode.trim()}
            style={{
              width: "100%",
              padding: "20px",
              fontSize: "24px",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "none",
              background: loading || !classCode.trim()
                ? "rgba(255, 255, 255, 0.1)"
                : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              color: "white",
              cursor: loading || !classCode.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading && classCode.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.4)";
            }}
          >
            {loading ? "Adding Students..." : `➕ Add ${students.filter(s => s.firstName.trim() && s.lastName.trim()).length} Student(s)`}
          </button>
        </form>
      </div>
    </div>
  );
}
