// app/dashboard/reading/page.tsx

import Link from "next/link";

export default function ReadingPage() {
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
            My Reading Ladder
          </h1>
          <div className="w-12" />
        </header>

        <main className="space-y-6">
          {/* STAR Progress placeholder */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1A2740]">
                STAR Reading Progress
              </h2>
              <span className="text-xs text-[#A0A7B4]">
                Fall • Winter • Spring
              </span>
            </div>
            <div className="h-40 rounded-xl bg-[#FFE6F2] flex items-center justify-center text-xs text-[#A0A7B4]">
              (Reading chart will go here)
            </div>
          </section>

          {/* Current Level / Goal */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <div className="text-sm font-semibold text-[#1A2740]">
                  Year Goal
                </div>
                <div className="text-xs text-[#A0A7B4]">
                  Grow at least 1.0 grade level in reading.
                </div>
              </div>
              <div className="text-sm font-semibold text-[#1A2740]">
                Current: <span className="text-[#FF6FB5]">On Track</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#E0E5F2] overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-[#FF6FB5] to-[#2D7FFF]" />
            </div>
            <p className="mt-3 text-xs text-[#A0A7B4]">
              Keep reading 20 minutes each night to stay on track.
            </p>
          </section>

          {/* Practice & Quizzes */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Practice & Quizzes
            </h2>
            <div className="divide-y divide-[#E0E5F2] text-sm">
              <div className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Main Idea Passage
                  </div>
                  <div className="text-xs text-[#A0A7B4]">12/01</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                  84%
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Vocabulary Check
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/25</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FFF3CD] text-[#896100]">
                  76%
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Context Clues Practice
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/18</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                  89%
                </span>
              </div>
            </div>
          </section>

          {/* Reflection */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Reading Reflection
            </h2>
            <textarea
              className="w-full h-24 rounded-xl border border-[#E0E5F2] px-3 py-2 text-sm outline-none focus:border-[#FF6FB5] focus:ring-2 focus:ring-[#FF6FB5]/25 resize-none"
              placeholder="One thing I want to get better at in reading is..."
            />
          </section>
        </main>
      </div>
    </div>
  );
}
