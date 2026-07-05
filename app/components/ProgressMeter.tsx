"use client";

interface ProgressMeterProps {
  current: number;
  goal: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressMeter({
  current,
  goal,
  label = "Progress",
  showPercentage = true,
}: ProgressMeterProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isComplete = current >= goal;

  return (
    <div className="w-full">
      {/* Label and Stats */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold text-[#2a4cff] flex items-center gap-2">
          ⭐ {label}
        </span>
        <span className="text-base font-semibold text-[#ff2e80]">
          {current} / {goal} {showPercentage && `(${percentage}%)`}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-6 bg-gradient-to-r from-blue-100 to-pink-100 rounded-full overflow-hidden shadow-md">
        {/* Progress Fill */}
        <div
          className={`h-full transition-all duration-700 ease-out ${
            isComplete
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : "bg-gradient-to-r from-[#2a4cff] via-[#7d5fff] to-[#ff2e80]"
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>

        {/* Completion Badge */}
        {isComplete && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-base">✨🎉</span>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {isComplete ? (
        <p className="mt-3 text-base text-emerald-600 font-bold flex items-center gap-2">
          🎊 Amazing! You completed your goal! 🎊
        </p>
      ) : (
        <p className="mt-2 text-sm text-purple-600 font-medium">
          Keep going! You're doing great! 💪
        </p>
      )}
    </div>
  );
}
