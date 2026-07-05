const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "Mr. Ortiz";
pptx.title = "KidVision Student Dashboard";

// Color palette
const DARK_BG = "0f0f23";
const PURPLE = "a78bfa";
const BLUE = "3b82f6";
const GREEN = "10b981";
const PINK = "ec4899";
const YELLOW = "fbbf24";
const ORANGE = "f59e0b";
const WHITE = "FFFFFF";
const LIGHT_TEXT = "cccccc";

function darkSlide(pptx, opts = {}) {
  const slide = pptx.addSlide();
  slide.background = { color: opts.bg || DARK_BG };
  return slide;
}

// ============= SLIDE 1: TITLE =============
{
  const slide = darkSlide(pptx, { bg: "4c1d95" });
  slide.addText("🎓", { x: 0, y: 0.8, w: "100%", fontSize: 72, align: "center" });
  slide.addText("KidVision Student Dashboard", {
    x: 0.5, y: 2.0, w: 12.33, fontSize: 44, bold: true, color: WHITE, align: "center",
    shadow: { type: "outer", blur: 10, color: "000000", offset: 3, angle: 270 }
  });
  slide.addText("Empowering Students to Own Their Learning Journey", {
    x: 1, y: 3.2, w: 11.33, fontSize: 24, color: "e0d4ff", align: "center"
  });
  slide.addText("A Modern, District-Compliant Progress Tracking Solution", {
    x: 1, y: 4.0, w: 11.33, fontSize: 18, color: "c4b5fd", align: "center"
  });
  slide.addText("Presented by Mr. Ortiz", {
    x: 1, y: 5.8, w: 11.33, fontSize: 18, color: "b0a0e0", align: "center"
  });
}

// ============= SLIDE 2: THE CHALLENGE =============
{
  const slide = darkSlide(pptx);
  slide.addText("📋 The Challenge We're Solving", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  // Left column
  slide.addText("Current State", { x: 0.5, y: 1.3, w: 5.5, fontSize: 22, bold: true, color: BLUE });
  slide.addText([
    { text: "• Students rarely see their own progress data\n", options: { fontSize: 15, color: LIGHT_TEXT, breakType: "none" } },
    { text: "• Assessment results live in teacher gradebooks\n", options: { fontSize: 15, color: LIGHT_TEXT } },
    { text: "• Limited student engagement with learning goals\n", options: { fontSize: 15, color: LIGHT_TEXT } },
    { text: "• Data is numbers without context", options: { fontSize: 15, color: LIGHT_TEXT } },
  ], { x: 0.5, y: 1.8, w: 5.5, h: 2.5, valign: "top" });

  // Right column
  slide.addText("What Research Shows", { x: 6.8, y: 1.3, w: 5.5, fontSize: 22, bold: true, color: BLUE });
  slide.addText([
    { text: "• Effect size of 1.33 for self-reported grades (Hattie, 2023)\n", options: { fontSize: 15, color: LIGHT_TEXT } },
    { text: "• Self-assessment improves achievement by 0.5-0.7 effect size\n", options: { fontSize: 15, color: LIGHT_TEXT } },
    { text: "• Formative feedback doubles learning gains (Black & Wiliam)\n", options: { fontSize: 15, color: LIGHT_TEXT } },
    { text: "• Goal-setting effect size: 0.68", options: { fontSize: 15, color: LIGHT_TEXT } },
  ], { x: 6.8, y: 1.8, w: 5.5, h: 2.5, valign: "top" });

  // Quote
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 4.5, w: 11.5, h: 1.4, fill: { color: "1a1040" },
    rectRadius: 0.1, line: { color: "8b5cf6", width: 1 }
  });
  slide.addText('"When students become their own teachers, they exhibit the self-regulatory attributes that seem most desirable for learners."\n— John Hattie, Visible Learning (2009)', {
    x: 1.0, y: 4.6, w: 11.1, h: 1.2, fontSize: 14, italic: true, color: PURPLE, align: "center"
  });

  // Sources
  slide.addText("📚 Hattie (2023) Visible Learning • Black & Wiliam (1998) Inside the Black Box • Zimmerman (2002) Self-Regulated Learning", {
    x: 0.5, y: 6.2, w: 12, fontSize: 10, color: "888888", align: "center"
  });
}

// ============= SLIDE 3: SOLUTION OVERVIEW =============
{
  const slide = darkSlide(pptx);
  slide.addText("💡 Our Solution: KidVision", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });
  
  slide.addText("A student-facing dashboard that transforms assessment data into an engaging, gamified experience while maintaining complete district data compliance.", {
    x: 0.5, y: 1.2, w: 12, fontSize: 18, color: LIGHT_TEXT
  });

  const features = [
    { icon: "📊", title: "Visual Progress Tracking", desc: "Charts and progress bars across Math, Reading, and Science", x: 0.5, y: 2.2 },
    { icon: "🎮", title: "Points-Based Motivation", desc: "Every assessment earns points toward a 500-point goal", x: 6.8, y: 2.2 },
    { icon: "💾", title: "Local Data Storage", desc: "Data saved in browser localStorage — no servers, no internet needed", x: 0.5, y: 4.2 },
    { icon: "✏️", title: "Student Data Entry", desc: "Students enter their own scores, building ownership and responsibility", x: 6.8, y: 4.2 },
  ];

  features.forEach(f => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: f.x, y: f.y, w: 5.8, h: 1.6, fill: { color: "1a1a3e" },
      rectRadius: 0.15, line: { color: "333366", width: 1 }
    });
    slide.addText(f.icon, { x: f.x + 0.2, y: f.y + 0.2, w: 1, fontSize: 36 });
    slide.addText(f.title, { x: f.x + 1.2, y: f.y + 0.2, w: 4.2, fontSize: 18, bold: true, color: YELLOW });
    slide.addText(f.desc, { x: f.x + 1.2, y: f.y + 0.8, w: 4.2, fontSize: 14, color: LIGHT_TEXT });
  });
}

// ============= SLIDE 4: POINTS SYSTEM =============
{
  const slide = darkSlide(pptx);
  slide.addText("🏆 The Points System", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  slide.addText("Students earn points based on assessment performance, creating intrinsic motivation to improve:", {
    x: 0.5, y: 1.2, w: 12, fontSize: 16, color: LIGHT_TEXT
  });

  // Assessment types
  const types = [
    { icon: "📝", label: "Quizzes", pts: "5-15 pts each", color: BLUE },
    { icon: "📋", label: "Unit Tests", pts: "5-15 pts each", color: PINK },
    { icon: "🎯", label: "FAST PM", pts: "15-25 pts", color: "8b5cf6" },
    { icon: "⭐", label: "STAR Tests", pts: "15-25 pts", color: GREEN },
  ];

  types.forEach((t, i) => {
    const x = 0.5 + i * 3.1;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.8, w: 2.8, h: 1.8, fill: { color: "1a1a3e" },
      rectRadius: 0.15, line: { color: t.color, width: 2 }
    });
    slide.addText(t.icon, { x, y: 1.9, w: 2.8, fontSize: 36, align: "center" });
    slide.addText(t.label, { x, y: 2.6, w: 2.8, fontSize: 16, bold: true, color: WHITE, align: "center" });
    slide.addText(t.pts, { x, y: 3.1, w: 2.8, fontSize: 12, color: LIGHT_TEXT, align: "center" });
  });

  // Points table
  slide.addText("Points Scale by Performance", { x: 0.5, y: 4.0, w: 12, fontSize: 22, bold: true, color: BLUE });

  const tableRows = [
    [{ text: "Score Range", options: { bold: true, color: WHITE, fill: { color: "2d1b69" } } },
     { text: "Points Earned", options: { bold: true, color: WHITE, fill: { color: "2d1b69" } } },
     { text: "Message to Student", options: { bold: true, color: WHITE, fill: { color: "2d1b69" } } }],
    [{ text: "70-79%" }, { text: "+5 points", options: { color: YELLOW, bold: true } }, { text: '"Good effort! Keep practicing!"' }],
    [{ text: "80-89%" }, { text: "+7 points", options: { color: YELLOW, bold: true } }, { text: '"Great job! You\'re getting it!"' }],
    [{ text: "90-99%" }, { text: "+9 points", options: { color: YELLOW, bold: true } }, { text: '"Excellent work!"' }],
    [{ text: "100%" }, { text: "+15 points", options: { color: YELLOW, bold: true } }, { text: '"Perfect score! Amazing!"' }],
  ];

  slide.addTable(tableRows, {
    x: 0.5, y: 4.5, w: 12, fontSize: 14, color: LIGHT_TEXT,
    border: { type: "solid", pt: 1, color: "333366" },
    rowH: [0.4, 0.4, 0.4, 0.4, 0.4],
    colW: [3, 3, 6],
  });
}

// ============= SLIDE 5: WHAT STUDENTS SEE =============
{
  const slide = darkSlide(pptx);
  slide.addText("🖥️ What Students See", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  // Mock dashboard
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.3, w: 11.5, h: 5.0, fill: { color: "1e1e3f" },
    rectRadius: 0.2, line: { color: "8b5cf6", width: 2 }
  });

  slide.addText("🔢 Math Progress Dashboard", { x: 1.2, y: 1.5, w: 6, fontSize: 20, bold: true, color: WHITE });
  slide.addText("340", { x: 9.5, y: 1.5, w: 2, fontSize: 40, bold: true, color: "8b5cf6", align: "right" });
  slide.addText("/ 500 points", { x: 9.5, y: 2.3, w: 2, fontSize: 12, color: LIGHT_TEXT, align: "right" });

  // Progress bar
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.2, y: 2.7, w: 10.5, h: 0.5, fill: { color: "0a0a1a" }, rectRadius: 0.25
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.2, y: 2.7, w: 7.1, h: 0.5, fill: { color: "8b5cf6" }, rectRadius: 0.25
  });
  slide.addText("68%", { x: 7.3, y: 2.7, w: 1, h: 0.5, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle" });

  // Subject boxes
  const boxes = [
    { label: "📝 Quizzes", pts: "85", color: BLUE },
    { label: "📋 Unit Tests", pts: "120", color: PINK },
    { label: "🎯 FAST PM", pts: "75", color: "8b5cf6" },
    { label: "⭐ STAR", pts: "60", color: GREEN },
  ];
  boxes.forEach((b, i) => {
    const x = 1.2 + i * 2.7;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.6, w: 2.4, h: 1.5, fill: { color: "151530" }, rectRadius: 0.12
    });
    slide.addText(b.label, { x, y: 3.7, w: 2.4, fontSize: 11, color: LIGHT_TEXT, align: "center" });
    slide.addText(b.pts, { x, y: 4.2, w: 2.4, fontSize: 28, bold: true, color: b.color, align: "center" });
  });

  slide.addText("Bar charts show individual scores • Progress meter shows journey to 500 points • Color-coded feedback", {
    x: 0.5, y: 5.6, w: 12, fontSize: 14, color: LIGHT_TEXT, align: "center"
  });
}

// ============= SLIDE 6: THREE SUBJECTS =============
{
  const slide = darkSlide(pptx);
  slide.addText("📚 Three Core Subject Areas", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  slide.addText("Each student has a single data file containing progress across all subjects:", {
    x: 0.5, y: 1.2, w: 12, fontSize: 16, color: LIGHT_TEXT
  });

  const subjects = [
    { icon: "🔢", name: "Mathematics", color: BLUE, items: "Quizzes & Unit Tests\nFAST Progress Monitoring\nSTAR Math Assessments\nPercentage & Scale Scores" },
    { icon: "📖", name: "Reading", color: PINK, items: "Reading Comprehension\nFAST ELA Monitoring\nSTAR Reading\nFluency Assessments" },
    { icon: "🔬", name: "Science", color: GREEN, items: "Unit Assessments\nLab Reports\nScience Benchmarks\nProject Scores" },
  ];

  subjects.forEach((s, i) => {
    const x = 0.5 + i * 4.2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.8, w: 3.8, h: 4.2, fill: { color: "1a1a3e" },
      rectRadius: 0.15, line: { color: s.color, width: 2 }
    });
    slide.addText(s.icon, { x, y: 2.0, w: 3.8, fontSize: 48, align: "center" });
    slide.addText(s.name, { x, y: 2.9, w: 3.8, fontSize: 22, bold: true, color: s.color, align: "center" });
    slide.addText(s.items, { x: x + 0.3, y: 3.5, w: 3.2, fontSize: 14, color: LIGHT_TEXT, lineSpacingMultiple: 1.5 });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 2.5, y: 6.2, w: 8, h: 0.6, fill: { color: "1a1040" }, rectRadius: 0.1
  });
  slide.addText("📁 One file per student:  kidvision-Emma.json", {
    x: 2.5, y: 6.2, w: 8, h: 0.6, fontSize: 16, color: LIGHT_TEXT, align: "center", valign: "middle"
  });
}

// ============= SLIDE 7: DATA SECURITY =============
{
  const slide = darkSlide(pptx);
  slide.addText("🔒 Data Security & Compliance", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  slide.addText("KidVision runs 100% locally — no servers, no databases, no internet required.", {
    x: 0.5, y: 1.2, w: 12, fontSize: 18, color: LIGHT_TEXT
  });

  const items = [
    { icon: "🏫", title: "No External Servers", desc: "Everything runs on the student's local computer. No data leaves the machine." },
    { icon: "🔐", title: "No Authentication Needed", desc: "Students just type their first name. No passwords, no accounts to manage." },
    { icon: "💾", title: "Browser localStorage Only", desc: "Data is stored in the browser's built-in localStorage — private to that computer." },
    { icon: "📋", title: "FERPA Compliant", desc: "No student information is transmitted anywhere. Zero network activity." },
  ];

  items.forEach((item, i) => {
    const x = (i % 2) * 6.3 + 0.5;
    const y = Math.floor(i / 2) * 2.0 + 1.8;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.8, h: 1.7, fill: { color: "0a2520" }, rectRadius: 0.12, line: { color: "1a5040", width: 1 }
    });
    slide.addText(item.icon, { x: x + 0.2, y: y + 0.2, w: 0.8, fontSize: 30 });
    slide.addText(item.title, { x: x + 1.1, y: y + 0.2, w: 4.3, fontSize: 16, bold: true, color: GREEN });
    slide.addText(item.desc, { x: x + 1.1, y: y + 0.8, w: 4.3, fontSize: 12, color: LIGHT_TEXT });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 5.8, w: 12, h: 0.9, fill: { color: "0a2520" }, rectRadius: 0.1,
    line: { color: GREEN, width: 1 }
  });
  slide.addText("✅ Single HTML file (55 KB) — IT can review every line of source code. No hidden functionality.", {
    x: 0.7, y: 5.8, w: 11.6, h: 0.9, fontSize: 16, color: GREEN, align: "center", valign: "middle"
  });
}

// ============= SLIDE 8: HOW IT WORKS =============
{
  const slide = darkSlide(pptx);
  slide.addText("⚙️ How It Works", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  const steps = [
    { num: "1", title: "Student Opens File", desc: "Double-click\nkidvision.html" },
    { num: "2", title: "Types Their Name", desc: "First name only\n(one-time)" },
    { num: "3", title: "Enters Scores", desc: "After getting\nassessment back" },
    { num: "4", title: "Watches Points Grow!", desc: "Visual progress\ntoward 500 pts" },
  ];

  steps.forEach((s, i) => {
    const x = 0.5 + i * 3.2;
    // Number circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.9, y: 1.3, w: 0.8, h: 0.8, fill: { color: "8b5cf6" }
    });
    slide.addText(s.num, { x: x + 0.9, y: 1.3, w: 0.8, h: 0.8, fontSize: 24, bold: true, color: WHITE, align: "center", valign: "middle" });
    slide.addText(s.title, { x, y: 2.3, w: 2.6, fontSize: 16, bold: true, color: YELLOW, align: "center" });
    slide.addText(s.desc, { x, y: 2.8, w: 2.6, fontSize: 13, color: LIGHT_TEXT, align: "center" });

    if (i < 3) {
      slide.addText("→", { x: x + 2.6, y: 1.3, w: 0.6, h: 0.8, fontSize: 28, color: "8b5cf6", align: "center", valign: "middle" });
    }
  });

  // Two columns below
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 3.8, w: 5.8, h: 3.0, fill: { color: "0a2520" }, rectRadius: 0.12
  });
  slide.addText("✅ Benefits of Student Data Entry", { x: 0.8, y: 3.9, w: 5.2, fontSize: 16, bold: true, color: GREEN });
  slide.addText("• Ownership — Students take responsibility\n• Reflection — They review their own progress\n• No Teacher Burden — Zero extra work\n• Immediate — Students enter right away\n• Privacy — Data stays on their computer", {
    x: 0.8, y: 4.5, w: 5.2, fontSize: 14, color: LIGHT_TEXT, lineSpacingMultiple: 1.4
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 3.8, w: 5.8, h: 3.0, fill: { color: "1a1040" }, rectRadius: 0.12
  });
  slide.addText("👨‍🎓 Student Experience", { x: 7.1, y: 3.9, w: 5.2, fontSize: 16, bold: true, color: PURPLE });
  slide.addText("• Open kidvision.html in Edge\n• Type first name (one time only)\n• Click \"Add Assessment\" button\n• Select type (Quiz, Test, FAST, STAR)\n• Enter score and date\n• See points earned instantly!", {
    x: 7.1, y: 4.5, w: 5.2, fontSize: 14, color: LIGHT_TEXT, lineSpacingMultiple: 1.4
  });
}

// ============= SLIDE 9: BENEFITS =============
{
  const slide = darkSlide(pptx);
  slide.addText("✨ Benefits for Everyone", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  const benefits = [
    { icon: "👨‍🎓", title: "For Students", desc: "Enter their own scores, see progress visually, take ownership of learning" },
    { icon: "👩‍🏫", title: "For Teachers", desc: "Zero extra work — students do the data entry! Just return graded assessments" },
    { icon: "👨‍👩‍👧", title: "For Parents", desc: "Can view child's dashboard together, concrete conversation starters" },
    { icon: "🏫", title: "For Administration", desc: "Supports data-driven culture, builds student responsibility" },
    { icon: "🔒", title: "For IT Department", desc: "One-time 30-second setup, no maintenance, no servers to manage" },
    { icon: "💰", title: "For Budget", desc: "No licensing fees, no subscriptions — completely free" },
  ];

  benefits.forEach((b, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 1.3 + row * 2.5;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 3.8, h: 2.1, fill: { color: "1a1040" }, rectRadius: 0.12, line: { color: "333366", width: 1 }
    });
    slide.addText(b.icon, { x, y: y + 0.1, w: 3.8, fontSize: 36, align: "center" });
    slide.addText(b.title, { x, y: y + 0.8, w: 3.8, fontSize: 16, bold: true, color: PURPLE, align: "center" });
    slide.addText(b.desc, { x: x + 0.2, y: y + 1.2, w: 3.4, fontSize: 12, color: LIGHT_TEXT, align: "center" });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.5, y: 6.3, w: 10, h: 0.7, fill: { color: "1a1040" }, rectRadius: 0.1
  });
  slide.addText('"When students enter their own data, they become active participants in tracking their growth."', {
    x: 1.5, y: 6.3, w: 10, h: 0.7, fontSize: 14, italic: true, color: PURPLE, align: "center", valign: "middle"
  });
}

// ============= SLIDE 10: IMPLEMENTATION =============
{
  const slide = darkSlide(pptx);
  slide.addText("📅 Implementation Timeline", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  const timeline = [
    { num: "1", title: "Day 1: IT Setup", desc: "Edge browser setting change (30 seconds)", color: "8b5cf6" },
    { num: "2", title: "Day 1: Deploy File", desc: "Copy kidvision.html to student computers", color: "6366f1" },
    { num: "3", title: "Week 1: Pilot Class", desc: "Introduce dashboard, students start entering scores", color: BLUE },
    { num: "4", title: "Week 2+: Expand", desc: "Roll out to additional classrooms based on success", color: GREEN },
  ];

  timeline.forEach((t, i) => {
    const y = 1.3 + i * 1.3;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y, w: 0.6, h: 0.6, fill: { color: t.color }
    });
    slide.addText(t.num, { x: 0.8, y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle" });
    slide.addText(t.title, { x: 1.8, y, w: 4, fontSize: 18, bold: true, color: t.color });
    slide.addText(t.desc, { x: 1.8, y: y + 0.35, w: 6, fontSize: 14, color: LIGHT_TEXT });
    if (i < 3) {
      slide.addShape(pptx.ShapeType.line, { x: 1.1, y: y + 0.6, w: 0, h: 0.7, line: { color: "555588", width: 2 } });
    }
  });

  // Stats
  const stats = [
    { val: "~30 sec", label: "IT Setup Time", color: "8b5cf6" },
    { val: "0 min", label: "Teacher Setup Per Student", color: BLUE },
    { val: "$0", label: "Additional Cost", color: GREEN },
  ];
  stats.forEach((s, i) => {
    const x = 0.5 + i * 4.2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 6.0, w: 3.8, h: 1.0, fill: { color: "1a1a3e" }, rectRadius: 0.1
    });
    slide.addText(s.val, { x, y: 6.0, w: 3.8, h: 0.6, fontSize: 24, bold: true, color: s.color, align: "center", valign: "middle" });
    slide.addText(s.label, { x, y: 6.5, w: 3.8, h: 0.4, fontSize: 12, color: LIGHT_TEXT, align: "center", valign: "middle" });
  });
}

// ============= SLIDE 11: CALL TO ACTION =============
{
  const slide = darkSlide(pptx, { bg: "065f46" });
  slide.addText("🚀 Ready to Empower Our Students?", {
    x: 0.5, y: 0.8, w: 12, fontSize: 40, bold: true, color: WHITE, align: "center"
  });
  slide.addText("KidVision transforms how students interact with their academic progress — using tools we already have, with zero compliance concerns.", {
    x: 1.5, y: 2.0, w: 10, fontSize: 20, color: "d1fae5", align: "center"
  });

  const ctas = [
    { icon: "✅", title: "Approve IT Setup", desc: "30-second browser setting" },
    { icon: "👩‍🏫", title: "Select Pilot Class", desc: "One classroom to start" },
    { icon: "📈", title: "Watch Students Thrive", desc: "Increased engagement & ownership" },
  ];

  ctas.forEach((c, i) => {
    const x = 0.8 + i * 4.2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.5, w: 3.6, h: 2.2, fill: { color: "ffffff", transparency: 80 }, rectRadius: 0.15
    });
    slide.addText(c.icon, { x, y: 3.6, w: 3.6, fontSize: 36, align: "center" });
    slide.addText(c.title, { x, y: 4.3, w: 3.6, fontSize: 18, bold: true, color: WHITE, align: "center" });
    slide.addText(c.desc, { x, y: 4.9, w: 3.6, fontSize: 14, color: "d1fae5", align: "center" });
  });

  slide.addText("Next slide: What we need from IT →", {
    x: 0, y: 6.3, w: 13.33, fontSize: 24, color: WHITE, align: "center"
  });
}

// ============= SLIDE 12: IT REQUEST =============
{
  const slide = darkSlide(pptx);
  slide.addText("🔧 What We Need From IT", {
    x: 0.5, y: 0.3, w: 12, fontSize: 36, bold: true, color: PURPLE
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.0, w: 12, line: { color: PURPLE, width: 2 } });

  slide.addText("One simple browser setting change — no software installs, no servers, no maintenance.", {
    x: 0.5, y: 1.15, w: 12, fontSize: 17, bold: true, color: YELLOW
  });

  // Step 1
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.7, w: 12, h: 1.9, fill: { color: "0f1a3e" }, rectRadius: 0.12, line: { color: BLUE, width: 2 }
  });
  slide.addText("Step 1:", { x: 0.8, y: 1.8, w: 1.3, fontSize: 20, bold: true, color: YELLOW });
  slide.addText("Allow JavaScript for ONE local HTML file in Edge", { x: 2.1, y: 1.8, w: 10, fontSize: 18, bold: true, color: WHITE });
  slide.addText("Go to:", { x: 0.8, y: 2.4, w: 1, fontSize: 14, color: LIGHT_TEXT });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.6, y: 2.35, w: 5.5, h: 0.4, fill: { color: "0a0a1a" }, rectRadius: 0.05
  });
  slide.addText("edge://settings/content/javascript", { x: 1.7, y: 2.35, w: 5.3, h: 0.4, fontSize: 15, color: "93c5fd", fontFace: "Consolas", valign: "middle" });
  slide.addText('Under "Allow", add:', { x: 0.8, y: 2.9, w: 3, fontSize: 14, color: LIGHT_TEXT });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.5, y: 2.85, w: 6.5, h: 0.4, fill: { color: "0a0a1a" }, rectRadius: 0.05
  });
  slide.addText("file:///C:/KidVision/kidvision.html", { x: 3.6, y: 2.85, w: 6.3, h: 0.4, fontSize: 16, color: GREEN, fontFace: "Consolas", bold: true, valign: "middle" });

  // Step 2
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 3.85, w: 12, h: 1.1, fill: { color: "0f1a3e" }, rectRadius: 0.12, line: { color: BLUE, width: 2 }
  });
  slide.addText("Step 2:", { x: 0.8, y: 3.95, w: 1.3, fontSize: 20, bold: true, color: YELLOW });
  slide.addText("Place ONE file on student computers", { x: 2.1, y: 3.95, w: 10, fontSize: 18, bold: true, color: WHITE });
  slide.addText("Copy  kidvision.html  (55 KB) to  C:\\KidVision\\  on each student machine", {
    x: 0.8, y: 4.5, w: 11.4, fontSize: 15, color: LIGHT_TEXT
  });

  // Why it's safe - 3 boxes
  const safe = [
    { icon: "🔒", title: "No Internet Required", desc: "Runs 100% offline.\nNo data leaves the computer." },
    { icon: "📄", title: "Single HTML File", desc: "Just HTML, CSS & JS.\nNo executables. Fully reviewable." },
    { icon: "💾", title: "Local Storage Only", desc: "Data in browser localStorage.\nNothing is transmitted." },
  ];
  safe.forEach((s, i) => {
    const x = 0.5 + i * 4.2;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 5.2, w: 3.8, h: 1.2, fill: { color: "0a2520" }, rectRadius: 0.1, line: { color: "1a5040", width: 1 }
    });
    slide.addText(s.icon + " " + s.title, { x: x + 0.1, y: 5.25, w: 3.6, fontSize: 13, bold: true, color: GREEN, align: "center" });
    slide.addText(s.desc, { x: x + 0.1, y: 5.6, w: 3.6, fontSize: 11, color: LIGHT_TEXT, align: "center" });
  });

  // Bottom bar
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.5, y: 6.6, w: 10, h: 0.6, fill: { color: "1a1a30" }, rectRadius: 0.08, line: { color: YELLOW, width: 1 }
  });
  slide.addText("⏱️ Total IT time required: less than 5 minutes  |  Source code available for review (1,199 lines)", {
    x: 1.5, y: 6.6, w: 10, h: 0.6, fontSize: 14, color: YELLOW, align: "center", valign: "middle"
  });
}

// Write file
const outputPath = "c:\\Users\\visio\\OneDrive\\Desktop\\Developer Apps\\kidvision-student-app\\public\\KidVision-Presentation.pptx";
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log("✅ PowerPoint created: " + outputPath);
}).catch(err => {
  console.error("Error:", err);
});
