export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#07172a",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.2,
        }}
      >
        <source src="/teacher-video-2.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(4, 15, 30, 0.88), rgba(7, 29, 53, 0.82)), radial-gradient(circle at 15% 20%, rgba(41, 214, 255, 0.2), transparent 35%), radial-gradient(circle at 85% 65%, rgba(255, 197, 123, 0.2), transparent 35%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: "24px" }}>{children}</div>
    </div>
  );
}
