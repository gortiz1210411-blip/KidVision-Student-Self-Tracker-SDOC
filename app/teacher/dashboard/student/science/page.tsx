// app/dashboard/science/page.tsx

import * as React from "react";
import Link from "next/link";

const SciencePage: React.FC = () => {
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
            My Science Missions
          </h1>

          <div className="w-12" />
        </header>

        <main className="space-y-6">
          {/* Units Grid */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">Units</h2>

            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded-xl bg-gradient-to-br from-[#5AB4FF] to-[#C9A8FF] text-white p-3">
                Forms of Energy
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[#FF6FB5] to-[#FF9CCF] text-white p-3">
                Forces &amp; Motion
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[#7EE7D9] to-[#5AB4FF] text-white p-3">
                Earth &amp; Space
              </div>
            </div>
          </section>

          {/* Assessments */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Recent Assessments
            </h2>

            <div className="divide-y divide-[#E0E5F2] text-sm">
              <div className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Energy Quiz #1
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/30</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#DFF8E8] text-[#16784E]">
                  82%
                </span>
              </div>

              <div className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold text-[#1A2740]">
                    Exit Ticket – Light vs Sound
                  </div>
                  <div className="text-xs text-[#A0A7B4]">11/27</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FFF3CD] text-[#896100]">
                  4 / 5
                </span>
              </div>
            </div>
          </section>

          {/* Reflection */}
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-[#1A2740] mb-3">
              Science Reflection
            </h2>

            <textarea
              className="w-full h-24 rounded-xl border border-[#E0E5F2] px-3 py-2 text-sm outline-none focus:border-[#FF6FB5] focus:ring-2 focus:ring-[#FF6FB5]/25 resize-none"
              placeholder="One science question I still have is..."
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default SciencePage;
