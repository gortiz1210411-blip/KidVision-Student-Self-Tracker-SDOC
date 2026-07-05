// app/dashboard/habits/page.tsx

import Link from "next/link";

export default function HabitsPage() {
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
            My Habits
          </h1>
          <div className="w-12" />
        </header>

        <main className="space-y-6">
          {/* Attendance summary */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Attendance
            </h2>
            <p className="text-sm text-[#1A2740]">
              On time: <span className="font-semibold">45</span> / 50 days
            </p>
            <div className="mt-2 w-full h-2 rounded-full bg-[#E0E5F2] overflow-hidden">
              <div className="h-full w-[90%] bg-gradient-to-r from-[#2D7FFF] to-[#FF6FB5]" />
            </div>
            <p className="mt-2 text-xs text-[#A0A7B4]">
              You&apos;re building a strong attendance streak. Keep it going!
            </p>
          </section>

          {/* Weekly habits check-in */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Weekly Habits Check-In
            </h2>
            <p className="text-xs text-[#A0A7B4] mb-3">
              These are the habits you&apos;re working on this week.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-[#E0E5F2] p-3">
                <div className="font-semibold text-[#1A2740] mb-1">
                  Ready at Start
                </div>
                <p className="text-[#A0A7B4]">
                  I begin work quickly when it&apos;s time to learn.
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E5F2] p-3">
                <div className="font-semibold text-[#1A2740] mb-1">
                  Stay on Task
                </div>
                <p className="text-[#A0A7B4]">
                  I stay focused during independent and group work.
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E5F2] p-3">
                <div className="font-semibold text-[#1A2740] mb-1">
                  Kind Teammate
                </div>
                <p className="text-[#A0A7B4]">
                  I speak and act kindly toward others.
                </p>
              </div>
            </div>
          </section>

          {/* Behavior log */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Behavior Log
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Helped a classmate with math
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/29</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                  Positive
                </span>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Needed reminder to get started
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/26</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FFF3CD] text-[#896100]">
                  Reminder
                </span>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Great participation in science
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/25</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                  Positive
                </span>
              </div>
            </div>
          </section>

          {/* Reflection */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Habits Reflection
            </h2>
            <textarea
              className="w-full h-24 rounded-xl border border-[#E0E5F2] px-3 py-2 text-sm outline-none focus:border-[#FF6FB5] focus:ring-2 focus:ring-[#FF6FB5]/25 resize-none"
              placeholder="One habit I want to improve this week is..."
            />
          </section>
        </main>
      </div>
    </div>
  );
}
