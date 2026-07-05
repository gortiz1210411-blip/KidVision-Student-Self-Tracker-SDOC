"use client";

import Link from "next/link";

export default function Sidebar() {
  const linkStyle = {
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "white",
    textDecoration: "none",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <aside
      style={{
        width: "280px",
        background: "rgba(30, 27, 75, 0.6)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        padding: "30px 20px",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2 
        style={{ 
          marginBottom: "40px", 
          fontSize: "28px", 
          fontWeight: "bold",
          background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        🎓 KidVision
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link
          href="/teacher/dashboard"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          📊 Dashboard
        </Link>

        <div style={{ 
          marginTop: "20px", 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: "rgba(224, 231, 255, 0.6)",
          letterSpacing: "2px",
        }}>
          ASSESSMENTS
        </div>

        <Link
          href="/teacher/dashboard/assessments"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.3)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          📈 All Assessments
        </Link>

        <Link
          href="/teacher/dashboard/assessments/math"
          style={{...linkStyle, marginLeft: "12px", fontSize: "14px"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(6, 182, 212, 0.3)";
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          📊 Math
        </Link>

        <Link
          href="/teacher/dashboard/assessments/reading"
          style={{...linkStyle, marginLeft: "12px", fontSize: "14px"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(6, 182, 212, 0.3)";
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          📚 Reading
        </Link>

        <Link
          href="/teacher/dashboard/assessments/science"
          style={{...linkStyle, marginLeft: "12px", fontSize: "14px"}}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(6, 182, 212, 0.3)";
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          🔬 Science
        </Link>

        <div style={{ 
          marginTop: "20px", 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: "rgba(224, 231, 255, 0.6)",
          letterSpacing: "2px",
        }}>
          STUDENTS
        </div>

        <Link
          href="/teacher/dashboard/student"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(236, 72, 153, 0.3)";
            e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          👥 Student Roster
        </Link>

        <Link
          href="/teacher/dashboard/observations"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(236, 72, 153, 0.3)";
            e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          📝 Observations
        </Link>

        <div style={{ 
          marginTop: "20px", 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: "rgba(224, 231, 255, 0.6)",
          letterSpacing: "2px",
        }}>
          TOOLS
        </div>

        <Link
          href="/"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          🏠 Home
        </Link>
      </nav>
    </aside>
  );
}
