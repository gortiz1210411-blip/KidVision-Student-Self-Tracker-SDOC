export default function TeacherDashboard() {
  const snapshotCards = [
    { title: "Classroom Growth", value: "+1.24", subtitle: "Avg FAST growth band" },
    { title: "Proficiency Now", value: "67%", subtitle: "On track to district target" },
    { title: "Estimated Points", value: "148", subtitle: "School points from current class" },
    { title: "Mismatch Alerts", value: "3", subtitle: "Student vs district records" },
  ];

  const progressRows = [
    { student: "A. Rivera", level: "3", growth: "+18", proficiency: "Proficient", points: "12" },
    { student: "M. Chen", level: "2", growth: "+9", proficiency: "Approaching", points: "8" },
    { student: "K. Brooks", level: "4", growth: "+25", proficiency: "Exceeded", points: "15" },
    { student: "J. Patel", level: "1", growth: "+4", proficiency: "Developing", points: "4" },
  ];

  return (
    <main
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        color: "#f8fafc",
      }}
    >
      <section
        style={{
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          padding: "24px",
          marginBottom: "18px",
        }}
      >
        <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#b8ecff" }}>
          KidVision Teacher Command Center
        </p>
        <h1 style={{ margin: "10px 0", fontSize: "2rem" }}>Progress Intelligence Dashboard</h1>
        <p style={{ margin: 0, color: "rgba(248,250,252,0.9)", lineHeight: 1.55 }}>
          Student-centered, teacher-supported. Monitor student-entered scores, track growth and proficiency, and estimate point impact for your school in one view.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        {snapshotCards.map((card) => (
          <article
            key={card.title}
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.24)",
              padding: "18px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#c9f3ff" }}>{card.title}</p>
            <p style={{ margin: "10px 0 6px", fontSize: "2rem", fontWeight: 800 }}>{card.value}</p>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(248,250,252,0.78)" }}>{card.subtitle}</p>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <article
          style={{
            borderRadius: "22px",
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 14px 32px rgba(0,0,0,0.24)",
            padding: "18px",
            overflowX: "auto",
          }}
        >
          <h2 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>FAST Growth and Proficiency Table</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
            <thead>
              <tr>
                {[
                  "Student",
                  "FAST Level",
                  "Growth",
                  "Proficiency",
                  "Estimated Points",
                ].map((label) => (
                  <th
                    key={label}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(255,255,255,0.25)",
                      color: "#c9f3ff",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {progressRows.map((row) => (
                <tr key={row.student}>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{row.student}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{row.level}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{row.growth}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{row.proficiency}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <div style={{ display: "grid", gap: "14px" }}>
          <article
            style={{
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.24)",
              padding: "18px",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: "1.05rem" }}>District Data Alerts</h2>
            <p style={{ margin: "0 0 10px", fontSize: "14px", color: "rgba(248,250,252,0.86)" }}>
              3 student entries differ from district data this cycle.
            </p>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: 1.6 }}>
              <li>A. Rivera: FAST PM2 entered 317, district shows 315</li>
              <li>J. Patel: Unit 3 score entry missing district record</li>
              <li>M. Chen: Proficiency tag mismatch</li>
            </ul>
          </article>

          <article
            style={{
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.24)",
              padding: "18px",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: "1.05rem" }}>Teacher Leader Avatar</h2>
            <p style={{ margin: "0 0 6px", fontWeight: 700 }}>Water Mentor Leader</p>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(248,250,252,0.86)", lineHeight: 1.6 }}>
              Relationship-first coaching style. Next action: launch 5-minute student reflection circles after each progress check.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}