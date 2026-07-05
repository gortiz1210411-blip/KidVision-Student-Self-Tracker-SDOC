"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface HabitEntry {
  id: string;
  student_id: string;
  habit_name: string;
  rating: number; // 1-5 scale
  date: string;
  notes: string;
}

const HABITS = [
  { 
    name: "Growth Mindset", 
    icon: "🧠", 
    color: "#8b5cf6",
    definition: "I believe I can improve with effort and practice. I learn from mistakes and don't give up when things are hard."
  },
  { 
    name: "Collaboration", 
    icon: "🤝", 
    color: "#3b82f6",
    definition: "I work well with others, share ideas, listen to classmates, and help my team succeed together."
  },
  { 
    name: "Focus", 
    icon: "🎯", 
    color: "#ec4899",
    definition: "I pay attention to my work, avoid distractions, and stay on task even when it's challenging."
  },
  { 
    name: "Kindness", 
    icon: "💖", 
    color: "#f59e0b",
    definition: "I am caring and helpful to others. I use kind words and actions to make others feel good."
  },
  { 
    name: "Responsibility", 
    icon: "✅", 
    color: "#10b981",
    definition: "I complete my work on time, take care of my materials, and make good choices without being reminded."
  },
  { 
    name: "Perseverance", 
    icon: "💪", 
    color: "#14b8a6",
    definition: "I keep trying even when things are difficult. I don't give up and push through challenges."
  },
];

export default function StudentHabitsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    habit_name: "",
    rating: 5,
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch habit entries from API
  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/student/habits?student_id=${studentId}`);
        const data = await res.json();
        if (res.ok && data.habits) {
          // Map API response to component format
          const mapped = data.habits.map((h: { id?: string; habit_id?: string; student_id: string; habit_name: string; rating: number; entry_date: string; notes: string }) => ({
            id: h.id || h.habit_id || String(Math.random()),
            student_id: h.student_id,
            habit_name: h.habit_name,
            rating: h.rating,
            date: h.entry_date,
            notes: h.notes || "",
          }));
          setHabitEntries(mapped);
        } else {
          setHabitEntries([]);
        }
      } catch (err) {
        console.error("Error fetching habits:", err);
        setHabitEntries([]);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchHabits();
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/student/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          habit_name: formData.habit_name,
          rating: formData.rating,
          notes: formData.notes,
          entry_date: formData.date,
        }),
      });

      const data = await res.json();

      if (res.ok && data.habit) {
        const newEntry: HabitEntry = {
          id: data.habit.id || data.habit.habit_id || Date.now().toString(),
          student_id: studentId,
          habit_name: formData.habit_name,
          rating: formData.rating,
          date: formData.date,
          notes: formData.notes,
        };
        setHabitEntries([newEntry, ...habitEntries]);
      } else {
        // Still add locally even if API fails, for UX
        const newEntry: HabitEntry = {
          id: Date.now().toString(),
          student_id: studentId,
          habit_name: formData.habit_name,
          rating: formData.rating,
          date: formData.date,
          notes: formData.notes,
        };
        setHabitEntries([newEntry, ...habitEntries]);
      }
    } catch (err) {
      console.error("Error saving habit:", err);
      // Add locally for UX even on error
      const newEntry: HabitEntry = {
        id: Date.now().toString(),
        student_id: studentId,
        habit_name: formData.habit_name,
        rating: formData.rating,
        date: formData.date,
        notes: formData.notes,
      };
      setHabitEntries([newEntry, ...habitEntries]);
    }

    setFormData({
      habit_name: "",
      rating: 5,
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    setLoading(false);
  };

  const getHabitStats = (habitName: string) => {
    const entries = habitEntries.filter(e => e.habit_name === habitName);
    if (entries.length === 0) return { count: 0, avgRating: 0 };
    
    const avgRating = entries.reduce((sum, e) => sum + e.rating, 0) / entries.length;
    return { count: entries.length, avgRating: Math.round(avgRating * 10) / 10 };
  };

  const getStarDisplay = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          opacity: 0.2,
          filter: "hue-rotate(45deg) saturate(1.2)",
        }}
      >
        <source src="/dashboard-bg.mp4" type="video/mp4" />
      </video>

      {/* Color Overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(16, 185, 129, 0.3) 100%)",
        zIndex: -1,
      }} />

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
          ← Back
        </button>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "50px",
          animation: "fadeInDown 0.8s ease-out",
        }}>
          <div style={{
            fontSize: "80px",
            marginBottom: "20px",
            filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))",
          }}>
            🌟
          </div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "12px",
            textShadow: "0 0 30px rgba(245, 158, 11, 0.6)",
          }}>
            My Habits & Character
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "300",
          }}>
            Track your personal growth and positive behaviors
          </p>
        </div>

        {/* Habits Grid */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 50px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
        }}>
          {HABITS.map((habit, index) => {
            const stats = getHabitStats(habit.name);
            return (
              <div
                key={habit.name}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(30px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)",
                  transition: "all 0.3s ease",
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 15px 50px ${habit.color}50`;
                  e.currentTarget.style.borderColor = `${habit.color}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <div style={{
                  fontSize: "56px",
                  textAlign: "center",
                  marginBottom: "15px",
                  filter: `drop-shadow(0 4px 12px ${habit.color}80)`,
                }}>
                  {habit.icon}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  textAlign: "center",
                  marginBottom: "15px",
                }}>
                  {habit.name}
                </h3>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}>
                  <span style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    Entries:
                  </span>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: habit.color,
                  }}>
                    {stats.count}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                }}>
                  <span style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                    Avg Rating:
                  </span>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: habit.color,
                  }}>
                    {stats.avgRating > 0 ? stats.avgRating : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Entry Button */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 50px",
          textAlign: "center",
        }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: "16px",
              padding: "18px 40px",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(245, 158, 11, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.4)";
            }}
          >
            {showForm ? "Cancel" : "+ Add Habit Entry"}
          </button>
        </div>

        {/* Add Entry Form */}
        {showForm && (
          <div style={{
            maxWidth: "600px",
            margin: "0 auto 50px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(30px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "24px",
            padding: "35px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "fadeInUp 0.4s ease-out",
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "white",
              marginBottom: "25px",
              textAlign: "center",
            }}>
              Add Habit Entry
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Habit Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}>
                  Which habit? *
                </label>
                <select
                  required
                  value={formData.habit_name}
                  onChange={(e) => setFormData({ ...formData, habit_name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "15px",
                  }}
                >
                  <option value="" style={{ background: "#1a1a2e", color: "white" }}>-- Select a habit --</option>
                  {HABITS.map(habit => (
                    <option key={habit.name} value={habit.name} style={{ background: "#1a1a2e", color: "white" }}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </select>
                
                {/* Definition Display */}
                {formData.habit_name && (
                  <div style={{
                    marginTop: "12px",
                    padding: "15px",
                    background: "rgba(139, 92, 246, 0.15)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "12px",
                  }}>
                    <p style={{
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.9)",
                      margin: 0,
                    }}>
                      <strong style={{ color: "#a78bfa" }}>What it means:</strong> {HABITS.find(h => h.name === formData.habit_name)?.definition}
                    </p>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}>
                  How did you do? *
                </label>
                <div style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  padding: "15px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      style={{
                        fontSize: "32px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        opacity: formData.rating >= rating ? 1 : 0.3,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  marginTop: "8px",
                }}>
                  1 = Needs work, 5 = Excellent!
                </p>
              </div>

              {/* Date */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "15px",
                  }}
                />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "25px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "8px",
                }}>
                  Notes (What did you do well?)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Example: I helped my friend understand the math problem..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "15px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </form>
          </div>
        )}

        {/* Recent Entries */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "white",
            marginBottom: "25px",
            textAlign: "center",
          }}>
            Recent Entries
          </h2>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {habitEntries.length === 0 ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(30px)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                padding: "60px 40px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>📝</div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "12px",
                }}>
                  No entries yet
                </h3>
                <p style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}>
                  Start tracking your positive habits and character growth!
                </p>
              </div>
            ) : (
              habitEntries.map((entry, index) => {
                const habit = HABITS.find(h => h.name === entry.habit_name);
                return (
                  <div
                    key={entry.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(30px)",
                      border: "1.5px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      padding: "25px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)",
                      transition: "all 0.3s ease",
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 15px 50px ${habit?.color || "#8b5cf6"}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.25)";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}>
                      {/* Icon */}
                      <div style={{
                        fontSize: "48px",
                        width: "70px",
                        height: "70px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${habit?.color || "#8b5cf6"}20`,
                        border: `2px solid ${habit?.color || "#8b5cf6"}60`,
                        borderRadius: "16px",
                        flexShrink: 0,
                        boxShadow: `0 4px 16px ${habit?.color || "#8b5cf6"}30`,
                      }}>
                        {habit?.icon || "⭐"}
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
                          <h4 style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "white",
                          }}>
                            {entry.habit_name}
                          </h4>
                          <span style={{
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.6)",
                          }}>
                            📅 {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Rating */}
                        <div style={{
                          fontSize: "24px",
                          marginBottom: "12px",
                        }}>
                          {getStarDisplay(entry.rating)}
                        </div>

                        {/* Notes */}
                        {entry.notes && (
                          <p style={{
                            fontSize: "15px",
                            lineHeight: "1.6",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}>
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
