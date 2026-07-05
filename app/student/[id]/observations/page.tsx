"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Observation {
  observation_id: string;
  student_id: string;
  teacher_id: string;
  comment: string;
  category: string;
  score: number;
  timestamp: string;
}

export default function ObservationsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchObservations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/student/observations?student_id=${studentId}`);
        const json = await res.json();
        if (res.ok && Array.isArray(json.observations)) {
          setObservations(json.observations);
        } else {
          setObservations([]);
        }
      } catch (err) {
        setObservations([]);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchObservations();
  }, [studentId]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Math: "#3b82f6",
      Reading: "#ec4899",
      Science: "#10b981",
      "Social Skills": "#f59e0b",
      General: "#8b5cf6",
      "Growth Mindset": "#8b5cf6",
      Collaboration: "#3b82f6",
      Focus: "#ec4899",
      Kindness: "#f59e0b",
      Responsibility: "#10b981",
      Perseverance: "#14b8a6",
    };
    return colors[category] || "#8b5cf6";
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
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
    return icons[category] || "💬";
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
          filter: "hue-rotate(280deg) saturate(1.2)",
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
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(59, 130, 246, 0.3) 100%)",
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
            filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
          }}>
            💬
          </div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "12px",
            textShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
          }}>
            Teacher Comments
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "300",
          }}>
            Feedback and positive observations from your teacher
          </p>
        </div>

        {/* Observations Grid */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
          {loading && (
            <div style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              color: "white",
            }}>
              Loading comments...
            </div>
          )}

          {!loading && observations.length === 0 && (
            <div style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>📭</div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "white",
                marginBottom: "12px",
              }}>
                No comments yet
              </h3>
              <p style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.7)",
              }}>
                Your teacher hasn't added any observations yet. Keep up the great work!
              </p>
            </div>
          )}

          {!loading && observations.map((obs, index) => {
            const categoryColor = getCategoryColor(obs.category);
            return (
              <div
                key={obs.observation_id}
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
                  e.currentTarget.style.boxShadow = `0 15px 50px ${categoryColor}40`;
                  e.currentTarget.style.borderColor = `${categoryColor}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}>
                  {/* Category Icon */}
                  <div style={{
                    fontSize: "48px",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${categoryColor}20`,
                    border: `2px solid ${categoryColor}60`,
                    borderRadius: "16px",
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${categoryColor}30`,
                  }}>
                    {getCategoryIcon(obs.category)}
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
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: categoryColor,
                          background: `${categoryColor}20`,
                          padding: "6px 14px",
                          borderRadius: "20px",
                          border: `1px solid ${categoryColor}40`,
                        }}>
                          {obs.category}
                        </span>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#f59e0b",
                          background: "rgba(245, 158, 11, 0.2)",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          border: "1px solid rgba(245, 158, 11, 0.4)",
                        }}>
                          +{obs.score} pts
                        </span>
                      </div>
                      <span style={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}>
                        📅 {formatDate(obs.timestamp)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: "17px",
                      lineHeight: "1.7",
                      color: "white",
                      fontWeight: "400",
                    }}>
                      {obs.comment}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
