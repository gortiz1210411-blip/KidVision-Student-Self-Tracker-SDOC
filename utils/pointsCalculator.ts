/**
 * KidVision Points Calculator
 * 
 * Point System (out of 500 total points for the year):
 * 
 * Regular Assessments (Quizzes, Unit Tests):
 * - 70-79% = 5 points
 * - 80-89% = 7 points
 * - 90-99% = 9 points
 * - 100% = 15 points
 * 
 * FAST PM / STAR Tests (weighted importance):
 * - Proficient (scale score meets benchmark) = bonus points
 * - Growth (15+ scale score improvement) = bonus points
 */

export interface Assessment {
  id: string;
  assessment_type: string;
  test_name: string;
  score: number;
  max_score: number;
  date_given: string;
  is_scale_score?: boolean;
}

export interface PointsResult {
  totalPoints: number;
  maxPoints: number; // 500
  pointsBreakdown: {
    id: string;
    name: string;
    type: string;
    score: number;
    percentage: number;
    pointsEarned: number;
    date: string;
  }[];
  quizPoints: number;
  unitTestPoints: number;
  fastPmPoints: number;
  starPoints: number;
}

// Calculate points earned from a percentage score
export function calculatePointsFromPercentage(percentage: number): number {
  if (percentage === 100) return 15;
  if (percentage >= 90) return 9;
  if (percentage >= 80) return 7;
  if (percentage >= 70) return 5;
  return 0; // Below 70% = 0 points
}

// Calculate points for FAST PM / STAR tests
// These use scale scores, so we'll calculate based on proficiency levels
export function calculateFastPmPoints(scaleScore: number, subject: string): number {
  // Approximate grade 2 benchmarks (can be adjusted)
  const benchmarks: { [key: string]: { proficient: number; approaching: number } } = {
    math: { proficient: 497, approaching: 473 },
    reading: { proficient: 520, approaching: 497 },
    science: { proficient: 500, approaching: 480 },
  };
  
  const benchmark = benchmarks[subject.toLowerCase()] || benchmarks.math;
  
  // Points based on achievement level
  if (scaleScore >= benchmark.proficient) {
    return 20; // Proficient = 20 points
  } else if (scaleScore >= benchmark.approaching) {
    return 12; // Approaching = 12 points
  } else if (scaleScore >= benchmark.approaching - 30) {
    return 7; // Below but close = 7 points
  }
  return 3; // Participated = 3 points minimum
}

// Calculate growth bonus (comparing to previous test)
export function calculateGrowthBonus(currentScore: number, previousScore: number): number {
  const growth = currentScore - previousScore;
  if (growth >= 15) return 10; // 15+ scale points growth = 10 bonus points
  if (growth >= 10) return 6;  // 10-14 growth = 6 bonus points
  if (growth >= 5) return 3;   // 5-9 growth = 3 bonus points
  return 0;
}

// Main function to calculate all points for a subject
export function calculateSubjectPoints(
  assessments: Assessment[],
  subject: string
): PointsResult {
  const breakdown: PointsResult['pointsBreakdown'] = [];
  let quizPoints = 0;
  let unitTestPoints = 0;
  let fastPmPoints = 0;
  let starPoints = 0;

  // Sort by date for growth calculations
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime()
  );

  // Track previous FAST/STAR scores for growth
  let previousFastScore: number | null = null;

  sortedAssessments.forEach((assessment) => {
    const percentage = (assessment.score / assessment.max_score) * 100;
    let pointsEarned = 0;

    const type = assessment.assessment_type;
    const isScaleScoreTest = type === "FAST Progress Monitoring" || type === "STAR";

    if (isScaleScoreTest) {
      // FAST PM or STAR - use scale score calculation
      pointsEarned = calculateFastPmPoints(assessment.score, subject);
      
      // Add growth bonus if there's a previous score
      if (previousFastScore !== null) {
        pointsEarned += calculateGrowthBonus(assessment.score, previousFastScore);
      }
      previousFastScore = assessment.score;

      if (type === "FAST Progress Monitoring") {
        fastPmPoints += pointsEarned;
      } else {
        starPoints += pointsEarned;
      }
    } else {
      // Regular assessment - use percentage-based calculation
      pointsEarned = calculatePointsFromPercentage(percentage);

      if (type === "Quiz") {
        quizPoints += pointsEarned;
      } else if (type === "Unit Test") {
        unitTestPoints += pointsEarned;
      }
    }

    breakdown.push({
      id: assessment.id,
      name: assessment.test_name || assessment.assessment_type,
      type: assessment.assessment_type,
      score: assessment.score,
      percentage: Math.round(percentage),
      pointsEarned,
      date: assessment.date_given,
    });
  });

  const totalPoints = quizPoints + unitTestPoints + fastPmPoints + starPoints;

  return {
    totalPoints,
    maxPoints: 500,
    pointsBreakdown: breakdown,
    quizPoints,
    unitTestPoints,
    fastPmPoints,
    starPoints,
  };
}

// Get the color based on points percentage of goal
export function getPointsColor(points: number, maxPoints: number = 500): string {
  const percentage = (points / maxPoints) * 100;
  if (percentage >= 80) return "#10b981"; // Green - excellent
  if (percentage >= 60) return "#3b82f6"; // Blue - good
  if (percentage >= 40) return "#f59e0b"; // Yellow - progressing
  return "#ec4899"; // Pink - building
}

// Get encouragement message based on points
export function getEncouragementMessage(points: number, maxPoints: number = 500): string {
  const percentage = (points / maxPoints) * 100;
  if (percentage >= 80) return "🌟 Outstanding! You're a superstar!";
  if (percentage >= 60) return "🚀 Amazing progress! Keep reaching for the stars!";
  if (percentage >= 40) return "💪 Great job! Every point counts!";
  if (percentage >= 20) return "🌱 You're growing! Keep up the good work!";
  return "🎯 You've got this! Every assessment is a chance to earn more points!";
}
