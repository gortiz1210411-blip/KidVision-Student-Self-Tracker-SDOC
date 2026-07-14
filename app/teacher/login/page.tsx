"use client";

import { useRouter } from "next/navigation";

export default function TeacherLogin() {
  const router = useRouter();

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#061a2a",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.45,
        }}
      >
        <source src="/teacher-video-1.mp4" type="video/mp4" />
        <source src="/teacher-video-2.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,199,255,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,179,71,0.25), transparent 45%), linear-gradient(160deg, rgba(7,18,39,0.8), rgba(10,28,52,0.88))",
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(760px, 100%)",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.28)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
          padding: "34px",
          color: "#f8fafc",
        }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontSize: "12px",
            color: "#c7ecff",
          }}
        >
          KidVision Teacher Access
        </p>
        <h1 style={{ margin: "10px 0 10px", fontSize: "2.1rem", lineHeight: 1.15 }}>
          Enter The Leadership Glass Room
        </h1>
        <p style={{ margin: "0 0 22px", color: "rgba(248,250,252,0.9)", lineHeight: 1.6 }}>
          Student-centered and teacher-supported. Review growth, monitor FAST levels, and coach students using a single polished command center.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          {[
            "Glassmorphic leadership dashboard",
            "District mismatch alert lane",
            "Teacher leader avatar path",
          ].map((item) => (
            <div
              key={item}
              style={{
                borderRadius: "16px",
                padding: "14px",
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.1)",
                fontSize: "14px",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/teacher/dashboard")}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "13px 18px",
              color: "#02131e",
              fontWeight: 800,
              letterSpacing: "0.04em",
              cursor: "pointer",
              background: "linear-gradient(135deg, #7be5ff, #ffd483)",
            }}
          >
            Launch Dashboard
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              borderRadius: "14px",
              padding: "13px 18px",
              color: "#f8fafc",
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.12)",
            }}
          >
            Return Home
          </button>
        </div>
      </section>
    </main>
  );
}