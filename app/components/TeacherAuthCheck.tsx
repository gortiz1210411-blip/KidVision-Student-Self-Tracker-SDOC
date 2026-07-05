"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if teacher email is stored in localStorage
      const teacherEmail = localStorage.getItem("teacherEmail");
      const teacherId = localStorage.getItem("teacherId");

      if (!teacherEmail || !teacherId) {
        router.push("/teacher/login");
        return;
      }

      // Verify the email is still in approved list
      try {
        const response = await fetch("/api/teacher/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: teacherEmail }),
        });

        const data = await response.json();

        if (!response.ok || !data.approved) {
          // Email no longer approved, clear session
          localStorage.removeItem("teacherEmail");
          localStorage.removeItem("teacherId");
          router.push("/teacher/login");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/teacher/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #4c1d95 100%)",
      }}>
        <div style={{ color: "white", fontSize: "20px" }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
