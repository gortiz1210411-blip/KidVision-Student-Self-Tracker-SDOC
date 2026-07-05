"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const SUBJECTS = ["Math", "Science", "Reading"];
const LIKERT = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

const TEST_TYPES: { [key: string]: string[] } = {
  Math: ["Quiz", "Unit Test", "STAR", "FAST Progress Monitoring"],
  Reading: ["Quiz", "Unit Test", "STAR", "FAST Progress Monitoring"],
  Science: ["Quiz", "Concept Test", "Unit Test", "Quarterly Progress Monitoring"],
};

const SCALE_SCORE_TESTS = ["STAR", "FAST Progress Monitoring", "Quarterly Progress Monitoring"];

export default function StudentDataEntryPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("");
  const [assessmentName, setAssessmentName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [score, setScore] = useState("");
  const [stars, setStars] = useState(0);
  const [thoughtBetter, setThoughtBetter] = useState("");
  const [improveText, setImproveText] = useState("");
  const [likert1, setLikert1] = useState(2);
  const [likert2, setLikert2] = useState(2);
  const [likert3, setLikert3] = useState(2);
  const [likert4, setLikert4] = useState(2);
  const [likert5, setLikert5] = useState(2);
  const [likert6, setLikert6] = useState(2);
  const [likert7, setLikert7] = useState(2);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/student-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          subject,
          test_type: testType,
          assessment_name: assessmentName,
          test_date: testDate,
          score,
          feeling_before_test: stars,
          thought_would_do_better: thoughtBetter === "yes",
          felt_prepared: likert1,
          tried_my_best: likert2,
          want_to_improve: likert3,
          completed_classwork: likert4,
          completed_homework: likert5,
          active_participant: likert6,
          asked_for_help: likert7,
          improvement_text: improveText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save assessment");
        return;
      }

      setMessage("✅ Data submitted! Redirecting to dashboard...");
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push(`/student/${studentId}`);
      }, 2000);
    } catch (err) {
      setError("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: 600, margin: "0 auto" }}>
      {/* Back to Dashboard Button */}
      <button
        type="button"
        onClick={() => router.push(`/student/${studentId}`)}
        style={{
          background: "rgba(139, 92, 246, 0.2)",
          border: "1px solid #8b5cf6",
          borderRadius: 12,
          padding: "12px 24px",
          color: "#8b5cf6",
          fontSize: 16,
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: 24,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
        }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ fontSize: 48, fontWeight: "bold", color: "#8b5cf6", marginBottom: 32, textAlign: "center" }}>
        Student Data Entry
      </h1>
      <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 24, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        {/* Subject Selector */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8 }}>Subject</label>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {SUBJECTS.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => { setSubject(subj); setTestType(""); }}
                style={{
                  padding: "12px 24px",
                  fontSize: 20,
                  fontWeight: "bold",
                  borderRadius: 12,
                  border: subject === subj ? "2px solid #8b5cf6" : "1px solid #ccc",
                  background: subject === subj ? "#ede9fe" : "#f3f4f6",
                  color: subject === subj ? "#8b5cf6" : "#444",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Test Type Selector */}
        {subject && (
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8 }}>Test Type</label>
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              {TEST_TYPES[subject].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTestType(type)}
                  style={{
                    padding: "10px 20px",
                    fontSize: 18,
                    fontWeight: "bold",
                    borderRadius: 10,
                    border: testType === type ? "2px solid #ec4899" : "1px solid #ccc",
                    background: testType === type ? "#fdf2f8" : "#f3f4f6",
                    color: testType === type ? "#ec4899" : "#444",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Name */}
        {testType && (
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8, display: "block" }}>Assessment Name</label>
            <input
              type="text"
              value={assessmentName}
              onChange={e => setAssessmentName(e.target.value)}
              placeholder="e.g., Unit 5 Test, Chapter 3 Quiz"
              style={{ padding: "14px 18px", fontSize: 20, borderRadius: 8, border: "1px solid #ccc", maxWidth: "100%", width: "100%", marginTop: 8, boxSizing: "border-box" }}
              required
            />
          </div>
        )}

        {/* Test Date */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8, display: "block" }}>Test Date</label>
          <input
            type="date"
            value={testDate}
            onChange={e => setTestDate(e.target.value)}
            style={{ padding: "14px 18px", fontSize: 20, borderRadius: 8, border: "1px solid #ccc", maxWidth: "100%", width: "250px", marginTop: 8, boxSizing: "border-box" }}
            required
          />
        </div>

        {/* Score Input */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8, display: "block" }}>
            {SCALE_SCORE_TESTS.includes(testType) ? "Scale Score" : "Score Received"}
          </label>
          <input
            type="number"
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder={SCALE_SCORE_TESTS.includes(testType) ? "e.g., 450" : "e.g., 85"}
            style={{ padding: "14px 18px", fontSize: 20, borderRadius: 8, border: "1px solid #ccc", maxWidth: "100%", width: "200px", marginTop: 8, boxSizing: "border-box" }}
            min={0}
            max={SCALE_SCORE_TESTS.includes(testType) ? 999 : 100}
            required
          />
        </div>

        {/* Star Rating */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8 }}>How did you feel before the test?</label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                onClick={() => setStars(star)}
                style={{
                  fontSize: 32,
                  color: star <= stars ? "#f59e42" : "#ddd",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Thought Better */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8 }}>Did you think you would do better?</label>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <label style={{ fontSize: 20 }}>
              <input type="radio" name="thoughtBetter" value="yes" checked={thoughtBetter === "yes"} onChange={() => setThoughtBetter("yes")} /> Yes
            </label>
            <label style={{ fontSize: 20 }}>
              <input type="radio" name="thoughtBetter" value="no" checked={thoughtBetter === "no"} onChange={() => setThoughtBetter("no")} /> No
            </label>
          </div>
        </div>

        {/* Likert Questions */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 12, display: "block" }}>Reflection</label>
          
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I felt prepared for this test.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert1" checked={likert1 === i} onChange={() => setLikert1(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I tried my best.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert2" checked={likert2 === i} onChange={() => setLikert2(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I want to improve next time.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert3" checked={likert3 === i} onChange={() => setLikert3(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I completed all my classwork before the test.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert4" checked={likert4 === i} onChange={() => setLikert4(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I completed all my homework before the test.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert5" checked={likert5 === i} onChange={() => setLikert5(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I was an active participant in class discussions.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert6" checked={likert6 === i} onChange={() => setLikert6(i)} /> {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>I asked for help when I needed it.</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LIKERT.map((label, i) => (
                <label key={label} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}>
                  <input type="radio" name="likert7" checked={likert7 === i} onChange={() => setLikert7(i)} /> {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Improve Text - Open Ended */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 22, fontWeight: "bold", color: "#8b5cf6", marginBottom: 8, display: "block" }}>What could you have done better?</label>
          <textarea
            value={improveText}
            onChange={e => setImproveText(e.target.value)}
            placeholder="Type your answer..."
            style={{ padding: "14px 18px", fontSize: 20, borderRadius: 8, border: "1px solid #ccc", width: "100%", marginTop: 8, minHeight: 100, resize: "vertical", boxSizing: "border-box" }}
            maxLength={300}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !subject || !testType || !score}
          style={{
            width: "100%",
            padding: "20px",
            fontSize: 26,
            fontWeight: "bold",
            borderRadius: 14,
            border: "3px solid #fff",
            background: loading || !subject || !testType || !score ? "#ccc" : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            color: loading || !subject || !testType || !score ? "#888" : "#1a1a2e",
            textShadow: loading || !subject || !testType || !score ? "none" : "0 1px 2px rgba(255,255,255,0.3)",
            boxShadow: loading || !subject || !testType || !score ? "none" : "0 6px 20px rgba(139, 92, 246, 0.5)",
            cursor: loading || !subject || !testType || !score ? "not-allowed" : "pointer",
            marginTop: 20,
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {message && <div style={{ marginTop: 24, fontSize: 20, color: "#22c55e", textAlign: "center" }}>{message}</div>}
        {error && <div style={{ marginTop: 24, fontSize: 20, color: "#ef4444", textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
}
