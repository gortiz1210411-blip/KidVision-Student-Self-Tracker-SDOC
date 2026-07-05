"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithClassCode } from "@/app/actions/auth";

export default function StudentLogin() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [studentPin, setStudentPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-show login after 3 seconds or when video ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowLogin(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!classCode || !studentPin) {
        setError("Please enter both class code and PIN");
        setLoading(false);
        return;
      }

      // Use the server action to authenticate and get the student ID
      const result = await loginWithClassCode(classCode, studentPin);

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (!("studentId" in result) || !result.studentId) {
        setError("Class-code login is disabled in this district review build. Use the OneDrive flow or the local review bundle.");
        setLoading(false);
        return;
      }

      router.push(`/student/${result.studentId}`);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    }}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoEnded ? 0 : 1,
          transition: "opacity 1s ease-out",
        }}
      >
        <source src="/opening.mp4" type="video/mp4" />
        {/* Fallback gradient if video doesn't load */}
      </video>

      {/* Overlay gradient for better text visibility */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* Login Form Container */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${showLogin ? 1 : 0.8})`,
        opacity: showLogin ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: 10,
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "30px",
          padding: "50px 60px",
          minWidth: "450px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(139, 92, 246, 0.3)",
        }}>
          {/* Logo */}
          <div style={{
            textAlign: "center",
            marginBottom: "40px",
          }}>
            <img
              src="/logo.png"
              alt="KidVision"
              style={{ width: "220px", height: "auto", margin: "0 auto 20px", display: "block" }}
            />
            <p style={{
              fontSize: "14px",
              letterSpacing: "3px",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: "600",
            }}>
              STUDENT PORTAL
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "12px",
              color: "#fca5a5",
              fontSize: "14px",
              textAlign: "center",
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "8px",
              }}>
                CLASS CODE
              </label>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="ex: ORTIZ5B"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  fontSize: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.4)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "8px",
              }}>
                STUDENT PIN
              </label>
              <input
                type="password"
                value={studentPin}
                onChange={(e) => setStudentPin(e.target.value)}
                placeholder="Enter your 4-6 digit PIN"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  fontSize: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(236, 72, 153, 0.4)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "1px",
                color: "white",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(139, 92, 246, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(139, 92, 246, 0.4)";
              }}
            >
              {loading ? "ACCESSING..." : "ENTER DASHBOARD"}
            </button>
          </form>

          {/* Help Text */}
          <p style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.5)",
          }}>
            Ask your teacher for your class code and PIN
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 10px 50px rgba(139, 92, 246, 0.8), 0 0 60px rgba(236, 72, 153, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
