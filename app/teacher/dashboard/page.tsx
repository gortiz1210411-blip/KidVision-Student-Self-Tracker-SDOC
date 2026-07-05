export default function TeacherDashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #0f172a 0%, #10213d 55%, #19345f 100%)",
      }}
    >
      <section
        style={{
          width: "min(640px, 100%)",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          color: "#f8fafc",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 12px", fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd" }}>
          KidVision Student Review Build
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "2rem" }}>Teacher Dashboard Deferred</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "rgba(248,250,252,0.82)" }}>
          This branch is limited to the student-facing app for district review. Teacher workflows will be implemented in the next phase.
        </p>
      </section>
    </main>
  );
}