"use client";

import { useEffect, useState } from "react";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface Observation {
  observation_id: string;
  student_id: string;
  teacher_id: string;
  comment: string;
  category?: string;
  score: number;
  timestamp: string;
}

const categoryColors: Record<string, { bg: string; glow: string }> = {
  Math: { bg: "rgba(59, 130, 246, 0.2)", glow: "59, 130, 246" },
  Reading: { bg: "rgba(236, 72, 153, 0.2)", glow: "236, 72, 153" },
  Science: { bg: "rgba(16, 185, 129, 0.2)", glow: "16, 185, 129" },
  "Social Skills": { bg: "rgba(245, 158, 11, 0.2)", glow: "245, 158, 11" },
  General: { bg: "rgba(139, 92, 246, 0.2)", glow: "139, 92, 246" },
  "Growth Mindset": { bg: "rgba(139, 92, 246, 0.2)", glow: "139, 92, 246" },
  Collaboration: { bg: "rgba(59, 130, 246, 0.2)", glow: "59, 130, 246" },
  Focus: { bg: "rgba(236, 72, 153, 0.2)", glow: "236, 72, 153" },
  Kindness: { bg: "rgba(245, 158, 11, 0.2)", glow: "245, 158, 11" },
  Responsibility: { bg: "rgba(16, 185, 129, 0.2)", glow: "16, 185, 129" },
  Perseverance: { bg: "rgba(20, 184, 166, 0.2)", glow: "20, 184, 166" },
};

const categoryIcons: Record<string, string> = {
  Math: "🔢",
  Reading: "📚",
  Science: "🔬",
  "Social Skills": "🤝",
  General: "⭐",
  "Growth Mindset": "🧠",
  Collaboration: "🤝",
  Focus: "🎯",
  Kindness: "💖",
  Responsibility: "✅",
  Perseverance: "💪",
};

export default function ObservationsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [observations, setObservations] = useState<Observation[]>([]);
  const [obsLoading, setObsLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/get-students");
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    }
    async function fetchObservations() {
      setObsLoading(true);
      try {
        const res = await fetch("/api/teacher/observation");
        const data = await res.json();
        setObservations(Array.isArray(data.observations) ? data.observations : []);
      } catch (err) {
        setObservations([]);
      } finally {
        setObsLoading(false);
      }
    }
    fetchStudents();
    fetchObservations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedStudent || !comment.trim() || !score || !category) {
      setError("Please fill in all fields");
      return;
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum)) {
      setError("Score must be a valid number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/teacher/observation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent,
          teacher_id: "teacher-1",
          comment: comment.trim(),
          category: category,
          score: scoreNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save observation");
        return;
      }

      setMessage("Observation saved successfully!");
      setSelectedStudent("");
      setComment("");
      setCategory("");
      setScore("");
      
      // Refresh observations after submit
      try {
        const res = await fetch("/api/teacher/observation");
        const data = await res.json();
        setObservations(Array.isArray(data.observations) ? data.observations : []);
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    fontSize: "16px",
    fontWeight: 500,
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    color: "white",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "50px",
        animation: "fadeInDown 0.8s ease-out",
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "16px",
          textShadow: "0 0 30px rgba(236, 72, 153, 0.6)",
          background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          💬 Student Observations
        </h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.7)",
          fontWeight: 300,
        }}>
          Provide feedback and positive reinforcement to students
        </p>
      </div>

      {/* Main Form Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "32px",
        padding: "40px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        animation: "fadeInUp 0.6s ease-out",
        marginBottom: "60px",
      }}>
        {/* Success Message */}
        {message && (
          <div style={{
            background: "rgba(16, 185, 129, 0.2)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: "#34d399",
            fontSize: "16px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            ✅ {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: "#f87171",
            fontSize: "16px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Student Selection */}
          <div>
            <label style={labelStyle}>Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={loading}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "20px",
              }}
            >
              <option value="" style={{ background: "#1a1a2e", color: "white" }}>-- Choose a student --</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id} style={{ background: "#1a1a2e", color: "white" }}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "20px",
              }}
            >
              <option value="" style={{ background: "#1a1a2e", color: "white" }}>-- Choose a category --</option>
              <optgroup label="📚 Academic Subjects">
                <option value="Math" style={{ background: "#1a1a2e", color: "white" }}>🔢 Math</option>
                <option value="Reading" style={{ background: "#1a1a2e", color: "white" }}>📚 Reading</option>
                <option value="Science" style={{ background: "#1a1a2e", color: "white" }}>🔬 Science</option>
              </optgroup>
              <optgroup label="🌟 Character & Habits">
                <option value="Growth Mindset" style={{ background: "#1a1a2e", color: "white" }}>🧠 Growth Mindset</option>
                <option value="Collaboration" style={{ background: "#1a1a2e", color: "white" }}>🤝 Collaboration</option>
                <option value="Focus" style={{ background: "#1a1a2e", color: "white" }}>🎯 Focus</option>
                <option value="Kindness" style={{ background: "#1a1a2e", color: "white" }}>💖 Kindness</option>
                <option value="Responsibility" style={{ background: "#1a1a2e", color: "white" }}>✅ Responsibility</option>
                <option value="Perseverance" style={{ background: "#1a1a2e", color: "white" }}>💪 Perseverance</option>
              </optgroup>
              <optgroup label="📝 Other">
                <option value="Social Skills" style={{ background: "#1a1a2e", color: "white" }}>🤝 Social Skills</option>
                <option value="General" style={{ background: "#1a1a2e", color: "white" }}>⭐ General</option>
              </optgroup>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label style={labelStyle}>Observation Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your observation about the student's performance, behavior, or progress..."
              disabled={loading}
              style={{
                ...inputStyle,
                resize: "none",
              }}
            />
          </div>

          {/* Score */}
          <div>
            <label style={labelStyle}>Positive Score (Points)</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g., 5"
              min="0"
              max="10"
              disabled={loading}
              style={inputStyle}
            />
            <p style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "8px",
            }}>
              Award points for positive observations (1-10 points recommended)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "18px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: "16px",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(236, 72, 153, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(236, 72, 153, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(236, 72, 153, 0.4)";
            }}
          >
            {loading ? "Saving..." : "💾 Save Observation"}
          </button>
        </form>
      </div>

      {/* Recent Observations Section */}
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "30px",
          textAlign: "center",
          textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
        }}>
          📋 Recent Observations
        </h2>

        {obsLoading ? (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "18px",
            padding: "60px 20px",
          }}>
            Loading observations...
          </div>
        ) : observations.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "18px",
            padding: "60px 20px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "24px",
            border: "1px dashed rgba(255, 255, 255, 0.1)",
          }}>
            No observations yet. Add your first observation above!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {observations.map((obs, idx) => {
              const cat = obs.category || "General";
              const colors = categoryColors[cat] || categoryColors.General;
              const icon = categoryIcons[cat] || "💬";
              const student = students.find(s => s.student_id === obs.student_id);

              return (
                <div
                  key={obs.observation_id}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "24px",
                    padding: "28px 32px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s backwards`,
                    transition: "all 0.3s ease",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = `rgba(${colors.glow}, 0.5)`;
                    e.currentTarget.style.boxShadow = `0 16px 48px rgba(${colors.glow}, 0.3)`;
                    e.currentTarget.style.background = colors.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                >
                  {/* Category Accent */}
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: `linear-gradient(180deg, rgba(${colors.glow}, 1) 0%, rgba(${colors.glow}, 0.3) 100%)`,
                    borderRadius: "4px 0 0 4px",
                  }} />

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                    {/* Icon */}
                    <div style={{
                      fontSize: "40px",
                      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                    }}>
                      {icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}>
                        <div style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "white",
                        }}>
                          {student ? `${student.first_name} ${student.last_name}` : obs.student_id}
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}>
                          <span style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: `rgba(${colors.glow}, 1)`,
                            background: colors.bg,
                            padding: "6px 14px",
                            borderRadius: "20px",
                          }}>
                            {cat}
                          </span>
                          <span style={{
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}>
                            {new Date(obs.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <p style={{
                        fontSize: "16px",
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 1.6,
                        marginBottom: "12px",
                      }}>
                        {obs.comment}
                      </p>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}>
                        <span style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: `rgba(${colors.glow}, 1)`,
                        }}>
                          +{obs.score} pts
                        </span>
                        <span style={{
                          fontSize: "13px",
                          color: "rgba(255, 255, 255, 0.4)",
                        }}>
                          by {obs.teacher_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(236, 72, 153, 0.5) !important;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.3) !important;
        }

        select option {
          background: #1a1a2e;
          color: white;
        }
      `}</style>
    </div>
  );
}
