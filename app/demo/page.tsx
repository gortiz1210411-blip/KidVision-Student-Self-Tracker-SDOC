"use client";

import { useState, useEffect } from "react";

// Demo slides - each shows for ~3-4 seconds
const slides = [
  {
    id: 1,
    title: "Student Login",
    subtitle: "Simple class code + PIN access for young learners",
    icon: "🎓",
    color: "from-blue-600 to-purple-600",
    features: ["Class code entry", "Personal PIN", "Instant access to dashboard"],
    mockup: "login",
  },
  {
    id: 2,
    title: "Student Dashboard",
    subtitle: "Personalized learning hub for each student",
    icon: "🏠",
    color: "from-purple-600 to-pink-600",
    features: ["Progress overview", "Subject navigation", "Achievement tracking"],
    mockup: "dashboard",
  },
  {
    id: 3,
    title: "Math Progress",
    subtitle: "Track mathematical growth with visual charts",
    icon: "🔢",
    color: "from-green-500 to-teal-500",
    features: ["Assessment scores", "Progress meters", "Historical data"],
    mockup: "math",
  },
  {
    id: 4,
    title: "Reading Journey",
    subtitle: "Monitor literacy development over time",
    icon: "📚",
    color: "from-orange-500 to-red-500",
    features: ["FAST & STAR scores", "Reading levels", "Comprehension tracking"],
    mockup: "reading",
  },
  {
    id: 5,
    title: "Science Explorer",
    subtitle: "Track scientific understanding and curiosity",
    icon: "🔬",
    color: "from-cyan-500 to-blue-500",
    features: ["Unit assessments", "Concept mastery", "Quarterly progress"],
    mockup: "science",
  },
  {
    id: 6,
    title: "Teacher Dashboard",
    subtitle: "Powerful tools for educators",
    icon: "👩‍🏫",
    color: "from-violet-600 to-purple-700",
    features: ["Class overview", "Quick data entry", "Student management"],
    mockup: "teacher",
  },
];

// Mock UI components for each slide
function MockLogin() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "30px",
      width: "280px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="/logo.png"
          alt="KidVision"
          style={{ width: "140px", height: "auto", margin: "0 auto 10px", display: "block" }}
        />
        <div style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>Welcome Back!</div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>Class Code</div>
        <div style={{
          padding: "12px 14px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
        }}>MATH-204</div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase" }}>Student PIN</div>
        <div style={{
          padding: "12px 14px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
        }}>••••</div>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        borderRadius: "12px",
        padding: "14px",
        textAlign: "center",
        color: "white",
        fontWeight: "600",
      }}>Enter Class</div>
    </div>
  );
}

function MockDashboard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "20px",
      width: "320px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f472b6, #c084fc)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}>👧</div>
        <div>
          <div style={{ color: "white", fontWeight: "600" }}>Sample Student</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Elementary Demo Profile</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {["🔢 Math", "📚 Reading", "🔬 Science", "📊 Progress"].map((item) => (
          <div key={item} style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            color: "white",
            fontSize: "14px",
          }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function MockSubject({ subject, color, scores }: { subject: string; color: string; scores: number[] }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "20px",
      width: "320px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ color: "white", fontWeight: "600", marginBottom: "16px", fontSize: "16px" }}>
        {subject} Progress
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "100px", marginBottom: "12px" }}>
        {scores.map((score, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${score}%`,
            background: `linear-gradient(to top, ${color})`,
            borderRadius: "6px 6px 0 0",
            opacity: 0.7 + (i * 0.1),
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>
        <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
      </div>
      <div style={{
        marginTop: "16px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>Current Score</span>
        <span style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>{scores[scores.length - 1]}%</span>
      </div>
    </div>
  );
}

function MockTeacher() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "20px",
      width: "340px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ color: "white", fontWeight: "600", marginBottom: "16px" }}>Class Overview</div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Students", value: "24", color: "#3b82f6" },
          { label: "Avg Score", value: "87%", color: "#10b981" },
          { label: "Pending", value: "3", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: 1,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "12px",
            textAlign: "center",
          }}>
            <div style={{ color: stat.color, fontWeight: "700", fontSize: "20px" }}>{stat.value}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {["Emma J.", "Liam S.", "Olivia M."].map((name, i) => (
          <div key={name} style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ color: "white", fontSize: "13px" }}>{name}</span>
            <span style={{ color: "#4ade80", fontSize: "12px" }}>{95 - i * 5}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    // Slide transition
    const slideInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
        setIsTransitioning(false);
      }, 500);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, []);

  const slide = slides[currentSlide];

  const renderMockup = () => {
    switch (slide.mockup) {
      case "login":
        return <MockLogin />;
      case "dashboard":
        return <MockDashboard />;
      case "math":
        return <MockSubject subject="Math" color="#10b981, #14b8a6" scores={[65, 72, 78, 85, 92]} />;
      case "reading":
        return <MockSubject subject="Reading" color="#f97316, #ef4444" scores={[70, 75, 80, 82, 88]} />;
      case "science":
        return <MockSubject subject="Science" color="#06b6d4, #3b82f6" scores={[60, 68, 75, 80, 85]} />;
      case "teacher":
        return <MockTeacher />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${slide.color.includes("from-") ? "#1a0533" : "#1a0533"})`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${getGradientColors(slide.color)})`,
        opacity: isTransitioning ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
      }} />

      {/* Floating orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        filter: "blur(60px)",
        animation: "float 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        filter: "blur(80px)",
        animation: "float 8s ease-in-out infinite reverse",
      }} />

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "rgba(255,255,255,0.1)",
        zIndex: 50,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
          transition: "width 0.05s linear",
        }} />
      </div>

      {/* Slide indicators */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        zIndex: 50,
      }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentSlide ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === currentSlide ? "white" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px 40px",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "60px",
          maxWidth: "1000px",
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.5s ease-in-out",
        }}>
          {/* Left: Text content */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{
              fontSize: "60px",
              marginBottom: "16px",
            }}>
              {slide.icon}
            </div>
            <h1 style={{
              fontSize: "42px",
              fontWeight: "800",
              color: "white",
              marginBottom: "12px",
              lineHeight: 1.1,
            }}>
              {slide.title}
            </h1>
            <p style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "24px",
            }}>
              {slide.subtitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {slide.features.map((feature, i) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "15px",
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease forwards ${i * 0.15}s`,
                  }}
                >
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}>✓</div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mockup */}
          <div style={{
            transform: "perspective(1000px) rotateY(-5deg)",
            animation: "floatMockup 3s ease-in-out infinite",
          }}>
            {renderMockup()}
          </div>
        </div>
      </div>

      {/* Footer branding */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 50,
      }}>
        <img
          src="/logo.png"
          alt="KidVision"
          style={{ height: "32px", width: "auto" }}
        />
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>| Student Progress Tracker</span>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatMockup {
          0%, 100% { transform: perspective(1000px) rotateY(-5deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-5deg) translateY(-10px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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

function getGradientColors(colorClass: string): string {
  const gradients: Record<string, string> = {
    "from-blue-600 to-purple-600": "#1e3a8a, #4c1d95",
    "from-purple-600 to-pink-600": "#4c1d95, #9d174d",
    "from-green-500 to-teal-500": "#047857, #0d9488",
    "from-orange-500 to-red-500": "#c2410c, #b91c1c",
    "from-cyan-500 to-blue-500": "#0891b2, #1d4ed8",
    "from-violet-600 to-purple-700": "#5b21b6, #6d28d9",
  };
  return gradients[colorClass] || "#1a0533, #4c1d95";
}
