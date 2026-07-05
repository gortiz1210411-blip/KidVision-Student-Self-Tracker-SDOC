"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FBFF] to-[#E8D4FF]">
      <header className="bg-white shadow-sm border-b border-[#E0E5F2]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1A2740]">Profile</h1>
            <p className="text-sm text-[#A0A7B4]">Student ID: {studentId}</p>
          </div>
          <Link href={`/student/${studentId}`} className="text-sm text-[#2D7FFF] font-semibold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#1A2740] mb-3">Student Details</h2>
          <p className="text-sm text-[#A0A7B4]">Profile data will appear here (name, class code, teacher, district, etc.).</p>
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#1A2740] mb-3">Upcoming Items</h2>
          <ul className="list-disc list-inside text-sm text-[#A0A7B4] space-y-2">
            <li>Next assessments or due dates.</li>
            <li>Notes or announcements.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
