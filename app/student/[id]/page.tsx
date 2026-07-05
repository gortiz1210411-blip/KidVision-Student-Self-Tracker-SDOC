"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentInfo {
  first_name: string;
  last_name: string;
  class_code: string;
  kidvision_id: string;
  avatar: string;
}

interface SubjectProgress {
  current: number;
  goal: number;
}

const AVATAR_OPTIONS = ["🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐸", "🐵", "🦉", "🦄", "🐲", "🦖", "🚀", "⭐", "🌈", "🎨"];

export default function StudentDashboard() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState({
    math: { current: 0, goal: 90 },
    reading: { current: 0, goal: 90 },
    science: { current: 0, goal: 90 },
  });

  // Fetch student info
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        console.log("Fetching student with ID:", studentId);
        const res = await fetch(`/api/get-students?student_id=${studentId}`);
        const data = await res.json();
        console.log("API response:", data);
        if (data.students && data.students.length > 0) {
          const s = data.students[0];
          console.log("Found student:", s);
          setStudent({
            first_name: s.first_name || "Student",
            last_name: s.last_name || "",
            class_code: s.class_code || "",
            kidvision_id: s.kidvision_id || studentId,
            avatar: s.avatar || "🦊",
          });
        } else {
          // Fallback if student not found
          setStudent({
            first_name: "Student",
            last_name: "",
            class_code: "",
            kidvision_id: studentId,
            avatar: "🦊",
          });
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        setStudent({
          first_name: "Student",
          last_name: "",
          class_code: "",
          kidvision_id: studentId,
          avatar: "🦊",
        });
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  // Fetch assessment progress for each subject
  useEffect(() => {
    const fetchProgress = async (subject: string) => {
      try {
        const res = await fetch(`/api/student/assessments?student_id=${studentId}&subject=${subject}`);
        const data = await res.json();
        if (data.assessments && data.assessments.length > 0) {
          const avg = Math.round(
            data.assessments.reduce((sum: number, a: { score: number; max_score: number }) => 
              sum + (a.score / a.max_score * 100), 0) / data.assessments.length
          );
          return avg;
        }
        return 0;
      } catch (error) {
        console.error(`Error fetching ${subject} progress:`, error);
        return 0;
      }
    };

    const loadAllProgress = async () => {
      const [mathAvg, readingAvg, scienceAvg] = await Promise.all([
        fetchProgress("math"),
        fetchProgress("reading"),
        fetchProgress("science"),
      ]);
      
      setSubjectProgress({
        math: { current: mathAvg, goal: 90 },
        reading: { current: readingAvg, goal: 90 },
        science: { current: scienceAvg, goal: 90 },
      });
    };

    if (studentId) {
      loadAllProgress();
    }
  }, [studentId]);

  const displayName = student 
    ? `${student.first_name} ${student.last_name ? student.last_name.substring(0, 3) : ""}` 
    : "";

  const handleAvatarChange = (newAvatar: string) => {
    if (student) {
      setStudent({ ...student, avatar: newAvatar });
      // TODO: Save to database
    }
    setShowAvatarPicker(false);
  };

  const cards = [
    {
      id: 1,
      title: "Math Assessments",
      description: "Add your math scores and track progress",
      icon: "🔢",
      color: "rgba(59, 130, 246, 0.2)",
      glowColor: "59, 130, 246",
      href: `/student/${studentId}/math`,
      progress: subjectProgress.math,
      progressColor: "#3b82f6",
    },
    {
      id: 2,
      title: "Reading Assessments",
      description: "Track your reading achievements",
      icon: "📚",
      color: "rgba(236, 72, 153, 0.2)",
      glowColor: "236, 72, 153",
      href: `/student/${studentId}/reading`,
      progress: subjectProgress.reading,
      progressColor: "#ec4899",
    },
    {
      id: 3,
      title: "Science Assessments",
      description: "Explore your science discoveries",
      icon: "🔬",
      color: "rgba(16, 185, 129, 0.2)",
      glowColor: "16, 185, 129",
      href: `/student/${studentId}/science`,
      progress: subjectProgress.science,
      progressColor: "#10b981",
    },
    {
      id: 4,
      title: "Teacher Comments",
      description: "View feedback and respond to your teacher",
      icon: "💬",
      color: "rgba(139, 92, 246, 0.2)",
      glowColor: "139, 92, 246",
      href: `/student/${studentId}/observations`,
    },
    {
      id: 5,
      title: "My Habits & Character",
      description: "Track your personal growth and positive behaviors",
      icon: "🌟",
      color: "rgba(245, 158, 11, 0.2)",
      glowColor: "245, 158, 11",
      href: `/student/${studentId}/habits`,
    },
    {
      id: 6,
      title: "Add New Assessment",
      description: "Enter a new test score and reflect on your work",
      icon: "📝",
      color: "rgba(168, 85, 247, 0.2)",
      glowColor: "168, 85, 247",
      href: `/student/${studentId}/data-entry`,
    },
  ];

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
          opacity: 0.15,
        }}
      >
        <source src="/dashboard-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: -1,
      }} />

      {/* Main Content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 20px",
      }}>
        {/* Avatar & Name Section */}
        <div style={{
          position: "relative",
          textAlign: "center",
          marginBottom: "40px",
          animation: "fadeInDown 0.8s ease-out",
        }}>
          {/* Avatar */}
          <div style={{
            position: "relative",
            display: "inline-block",
            marginBottom: "20px",
          }}>
            <div style={{
              fontSize: "120px",
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(59, 130, 246, 0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(0, 0, 0, 0.4), 0 0 80px rgba(59, 130, 246, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(59, 130, 246, 0.3)";
            }}
            >
              {student?.avatar || "🦊"}
            </div>
            {/* Edit Button */}
            <div style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "rgba(59, 130, 246, 0.9)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}>
              ✏️
            </div>
          </div>

          {/* Avatar Picker Modal */}
          {showAvatarPicker && (
            <div style={{
              position: "absolute",
              top: "200px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(20, 20, 40, 0.95)",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "25px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              zIndex: 100,
              width: "320px",
              animation: "fadeInUp 0.3s ease-out",
            }}>
              <h4 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "white",
                marginBottom: "15px",
                textAlign: "center",
              }}>
                Choose Your Avatar
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}>
                {AVATAR_OPTIONS.map((avatar) => (
                  <div
                    key={avatar}
                    onClick={() => handleAvatarChange(avatar)}
                    style={{
                      fontSize: "40px",
                      padding: "10px",
                      background: student?.avatar === avatar 
                        ? "rgba(59, 130, 246, 0.3)" 
                        : "rgba(255, 255, 255, 0.05)",
                      border: student?.avatar === avatar 
                        ? "2px solid rgba(59, 130, 246, 0.6)" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.background = student?.avatar === avatar 
                        ? "rgba(59, 130, 246, 0.3)" 
                        : "rgba(255, 255, 255, 0.05)";
                    }}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAvatarPicker(false)}
                style={{
                  marginTop: "15px",
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Student Name */}
          <h1 style={{
            fontSize: "42px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "12px",
            textShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
          }}>
            {displayName || "Student"}
          </h1>

          {/* Student Info */}
          {student && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.7)",
            }}>
              <span><strong style={{ color: "#3b82f6" }}>Class:</strong> {student.class_code}</span>
              <span><strong style={{ color: "#ec4899" }}>ID:</strong> {student.kidvision_id}</span>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <div style={{
          textAlign: "center",
          marginBottom: "50px",
          animation: "fadeInDown 1s ease-out",
        }}>
          <p style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "300",
          }}>
            🌟 Track your progress and reach your learning goals
          </p>
        </div>

        {/* Floating Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          width: "100%",
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => router.push(card.href)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "40px 30px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                e.currentTarget.style.borderColor = `rgba(${card.glowColor}, 0.5)`;
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(${card.glowColor}, 0.4)`;
                e.currentTarget.style.background = card.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: "64px",
                marginBottom: "20px",
                textAlign: "center",
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
              }}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "12px",
                textAlign: "center",
              }}>
                {card.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}>
                {card.description}
              </p>

              {/* Progress Meter (only for Math, Reading, Science) */}
              {card.progress && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}>
                      Current: {card.progress.current}%
                    </span>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: card.progressColor,
                    }}>
                      Goal: {card.progress.goal}%
                    </span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "8px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {/* Goal Line */}
                    <div style={{
                      position: "absolute",
                      left: `${card.progress.goal}%`,
                      top: 0,
                      width: "2px",
                      height: "100%",
                      background: card.progressColor,
                      boxShadow: `0 0 8px ${card.progressColor}`,
                      zIndex: 2,
                    }} />
                    {/* Progress Bar */}
                    <div style={{
                      height: "100%",
                      width: `${card.progress.current}%`,
                      background: `linear-gradient(90deg, ${card.progressColor}80, ${card.progressColor})`,
                      borderRadius: "10px",
                      transition: "width 0.6s ease",
                      boxShadow: `0 0 10px ${card.progressColor}`,
                    }} />
                  </div>
                </div>
              )}

              {/* Arrow Indicator */}
              <div style={{
                marginTop: card.progress ? "10px" : "20px",
                textAlign: "center",
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.5)",
              }}>
                →
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div style={{
          marginTop: "60px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "white",
            marginBottom: "12px",
          }}>
            🎉 You're In Control!
          </h3>
          <p style={{
            fontSize: "15px",
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: "1.6",
          }}>
            Click on any card above to add your scores and track your progress. Your teacher can review and help as needed. Keep up the great work! 💪
          </p>
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
