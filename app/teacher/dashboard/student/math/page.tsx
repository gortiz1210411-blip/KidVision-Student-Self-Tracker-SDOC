"use client";

// app/dashboard/math/page.tsx

import * as React from "react";
import Link from "next/link";
import { dataClient } from "@/lib/storageClient";

type Assessment = {
  id: string;
  name: string;
  date: string | null;
  score: number | null;
  max_score: number | null;
  type: string | null;
  subject: string | null;
};

const STUDENT_ID = "638bed48-75c7-477c-b93a-5a6484bd325b"; // 👈 replace if different

export default function MathPage() {
  const [assessments, setAssessments] = React.useState<Assessment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await dataClient
          .from("assessments")
          .select("id, name, date, score, max_score, type, subject")
          .eq("student_id", STUDENT_ID)
          .order("date", { ascending: false });

        if (error) {
          console.error("Assessment load error:", error);
          setError(error.message ?? "Could not load math assessments.");
          setLoading(false);
          return;
        }

        console.log("Loaded assessments:", data);
        setAssessments(data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading math data.");
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);

  return (
    <div className="min-h-screen bg-[#DDEEFF] px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-[#2D7FFF] hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1A2740]">
            My Math Journey
          </h1>
          <div className="w-12" />
        </header>

        <main className="space-y-6">
          {/* Year Goal Card */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <div className="text-sm font-semibold text-[#1A2740]">
                  Year Goal
                </div>
                <div className="text-xs text-[#A0A7B4]">
                  Move from Level 2 → Level 3 or higher.
                </div>
              </div>
              <div className="text-sm font-semibold text-[#1A2740]">
                Current: <span className="text-[#2D7FFF]">Level 3</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E0E5F2] overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#2D7FFF] to-[#FF6FB5]" />
            </div>
            <p className="mt-3 text-xs text-[#A0A7B4]">
              You’re on track to meet your math growth goal.
            </p>
          </section>

          {/* FAST Progress Placeholder */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1A2740]">
                FAST Progress
              </h2>
              <span className="text-xs text-[#A0A7B4]">PM1 • PM2 • PM3</span>
            </div>
            <div className="h-40 rounded-xl bg-[#F0F3FF] flex items-center justify-center text-xs text-[#A0A7B4]">
              (Chart will go here later)
            </div>
          </section>

          {/* Assignments List (from Storage) */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Assignments &amp; Quizzes
            </h2>

            {loading && (
              <p className="text-xs text-[#A0A7B4]">Loading math scores...</p>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            {!loading && !error && assessments.length === 0 && (
              <p className="text-xs text-[#A0A7B4]">
                No assessments found for this student. Check the `assessments`
                table.
              </p>
            )}

            {!loading && !error && assessments.length > 0 && (
              <div className="divide-y divide-[#E0E5F2] text-sm">
                {assessments.map((a) => (
                  <div key={a.id} className="py-2 flex justify-between">
                    <div>
                      <div className="font-semibold text-[#1A2740]">
                        {a.name}
                      </div>
                      <div className="text-xs text-[#A0A7B4]">
                        {a.date ?? "No date"}
                      </div>
                      {a.subject && (
                        <div className="text-[10px] uppercase text-[#C0C4D0]">
                          {a.subject}
                        </div>
                      )}
                    </div>
                    {a.score !== null ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                        {a.score}
                        {a.max_score ? ` / ${a.max_score}` : "%"}
                      </span>
                    ) : (
                      <span className="text-xs text-[#A0A7B4]">No score</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reflection */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Math Reflection
            </h2>
            <textarea
              className="w-full h-24 rounded-xl border border-[#E0E5F2] px-3 py-2 text-sm outline-none focus:border-[#FF6FB5] focus:ring-2 focus:ring-[#FF6FB5]/25 resize-none"
              placeholder="One thing I want to get better at in math is..."
            />
          </section>
        </main>
      </div>
    </div>
  );
}

