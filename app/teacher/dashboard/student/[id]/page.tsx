"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentData {
  student_id: string;
  first_name: string;
  last_name: string;
  kidvision_id: string | null;
  class_code: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  student_response?: string;
  response_date?: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch actual student data from API
  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch("/api/get-students");
        const data = await res.json();
        const students = data.students || [];
        
        // Find the student by ID
        const foundStudent = students.find((s: StudentData) => s.student_id === studentId);
        
        if (foundStudent) {
          setStudent(foundStudent);
          setEditFirstName(foundStudent.first_name || "");
          setEditLastName(foundStudent.last_name || "");
        }
        
        // TODO: Fetch actual comments from database
        setComments([]);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStudent();
  }, [studentId]);

  const handleSaveEdit = async () => {
    if (!student) return;
    
    setSaving(true);
    setSaveMessage("");
    
    try {
      const res = await fetch("/api/update-student", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.student_id,
          first_name: editFirstName.trim(),
          last_name: editLastName.trim(),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setSaveMessage(`❌ ${data.error}`);
        return;
      }
      
      // Update local state
      setStudent({
        ...student,
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
      });
      
      setIsEditing(false);
      setSaveMessage("✅ Saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("❌ Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        comment: newComment,
        created_at: new Date().toISOString(),
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

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
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
      }}>
        Student not found
      </div>
    );
  }

  const initials = `${(student.first_name || "?")[0]}${(student.last_name || "?")[0]}`;

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "12px 24px",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "30px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
          e.currentTarget.style.transform = "translateX(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        ← Back to Roster
      </button>

      {/* Student Header Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "40px",
        marginBottom: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          {/* Avatar */}
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            boxShadow: "0 0 40px rgba(236, 72, 153, 0.5)",
          }}>
            {initials}
          </div>

          {/* Student Info */}
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <>
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="First Name"
                    style={{
                      padding: "12px 16px",
                      fontSize: "24px",
                      fontWeight: "bold",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "2px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "12px",
                      color: "white",
                      width: "200px",
                    }}
                  />
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Last Name"
                    style={{
                      padding: "12px 16px",
                      fontSize: "24px",
                      fontWeight: "bold",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "2px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "12px",
                      color: "white",
                      width: "200px",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                      borderRadius: "10px",
                      color: "white",
                      fontWeight: "600",
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "✓ Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditFirstName(student.first_name || "");
                      setEditLastName(student.last_name || "");
                    }}
                    style={{
                      padding: "10px 20px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "10px",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
                  <h1 style={{
                    fontSize: "42px",
                    fontWeight: "bold",
                    color: "white",
                  }}>
                    {student.first_name || "No Name"} {student.last_name || ""}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(139, 92, 246, 0.2)",
                      border: "1px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "8px",
                      color: "#a78bfa",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(139, 92, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  {saveMessage && (
                    <span style={{ fontSize: "14px", color: saveMessage.includes("✅") ? "#10b981" : "#ef4444" }}>
                      {saveMessage}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                  <p style={{
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    <strong style={{ color: "rgba(139, 92, 246, 1)" }}>Class:</strong> {student.class_code}
                  </p>
                  <p style={{
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    <strong style={{ color: "rgba(139, 92, 246, 1)" }}>ID:</strong> {student.kidvision_id}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "40px",
        marginBottom: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "24px",
        }}>
          💬 Comments & Feedback
        </h2>

        {/* New Comment Input */}
        <div style={{ marginBottom: "30px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or observation about this student..."
            rows={4}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              color: "white",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            style={{
              marginTop: "16px",
              padding: "14px 32px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "12px",
              border: "none",
              background: newComment.trim() 
                ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                : "rgba(255, 255, 255, 0.1)",
              color: "white",
              cursor: newComment.trim() ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxShadow: newComment.trim() ? "0 4px 20px rgba(139, 92, 246, 0.4)" : "none",
            }}
            onMouseEnter={(e) => {
              if (newComment.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(139, 92, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (newComment.trim()) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.4)";
              }
            }}
          >
            Post Comment
          </button>
        </div>

        {/* Comment History */}
        <div>
          <h3 style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "white",
            marginBottom: "20px",
          }}>
            Comment History
          </h3>

          {comments.length === 0 ? (
            <p style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "16px",
              textAlign: "center",
              padding: "40px 0",
            }}>
              No comments yet. Add your first observation above.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    background: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "16px",
                    padding: "20px",
                  }}
                >
                  {/* Teacher Comment */}
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}>
                      <span style={{
                        fontSize: "20px",
                        color: "#8b5cf6",
                      }}>
                        👨‍🏫
                      </span>
                      <span style={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}>
                        {new Date(comment.created_at).toLocaleDateString()} at{" "}
                        {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{
                      color: "white",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}>
                      {comment.comment}
                    </p>
                  </div>

                  {/* Student Response (if exists) */}
                  {comment.student_response && (
                    <div style={{
                      marginTop: "15px",
                      paddingTop: "15px",
                      borderTop: "1px solid rgba(236, 72, 153, 0.3)",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}>
                        <span style={{
                          fontSize: "20px",
                          color: "#ec4899",
                        }}>
                          🎓
                        </span>
                        <span style={{
                          fontSize: "14px",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}>
                          Student Response -{" "}
                          {comment.response_date && new Date(comment.response_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        fontStyle: "italic",
                      }}>
                        {comment.student_response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
