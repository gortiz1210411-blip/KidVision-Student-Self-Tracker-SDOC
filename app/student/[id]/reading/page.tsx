"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { calculateSubjectPoints, getPointsColor, getEncouragementMessage, calculatePointsFromPercentage } from "@/utils/pointsCalculator";

interface ReadingAssessment {
  id: string;
  assessment_type: string;
  test_name: string;
  score: number;
  max_score: number;
  date_given: string;
  is_scale_score?: boolean;
}

export default function StudentReadingPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [assessments, setAssessments] = useState<ReadingAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/student/assessments?student_id=${studentId}&subject=reading`);
        const data = await response.json();
        if (data.assessments) {
          setAssessments(data.assessments);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAssessments();
    }
  }, [studentId]);

  // Calculate points using the new system
  const pointsResult = calculateSubjectPoints(assessments, "reading");
  const progressPercentage = (pointsResult.totalPoints / pointsResult.maxPoints) * 100;
  const progressColor = getPointsColor(pointsResult.totalPoints);

  // Group assessments by type
  const quizzes = assessments.filter(a => a.assessment_type === "Quiz").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const unitTests = assessments.filter(a => a.assessment_type === "Unit Test").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const fastTests = assessments.filter(a => a.assessment_type === "FAST Progress Monitoring").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());
  const starTests = assessments.filter(a => a.assessment_type === "STAR").sort((a, b) => new Date(a.date_given).getTime() - new Date(b.date_given).getTime());

  const getBarColor = (percentage: number) => {
    if (percentage === 100) return "#10b981";
    if (percentage >= 90) return "#22c55e";
    if (percentage >= 80) return "#3b82f6";
    if (percentage >= 70) return "#f59e0b";
    return "#ef4444";
  };

  // Bar chart component for assessments
  const AssessmentBarChart = ({ 
    data, 
    title, 
    icon, 
    color,
    isScaleScore = false,
    pointsEarned = 0,
  }: { 
    data: ReadingAssessment[]; 
    title: string; 
    icon: string; 
    color: string;
    isScaleScore?: boolean;
    pointsEarned?: number;
  }) => {
    if (data.length === 0) {
      return (
        <div style={{
          background: `${color}15`,
          backdropFilter: "blur(30px)",
          border: `2px solid ${color}40`,
          borderRadius: "24px",
          padding: "30px",
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color, marginBottom: "20px", textAlign: "center" }}>
            {icon} {title}
          </h3>
          <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255, 255, 255, 0.5)" }}>
            No assessments yet
          </div>
        </div>
      );
    }

    const maxBarHeight = 120;
    const maxScore = isScaleScore ? 999 : 100;

    return (
      <div style={{
        background: `${color}15`,
        backdropFilter: "blur(30px)",
        border: `2px solid ${color}40`,
        borderRadius: "24px",
        padding: "30px",
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", color, marginBottom: "25px", textAlign: "center" }}>
          {icon} {title}
        </h3>
        
        {/* Bar Chart */}
        <div style={{ 
          display: "flex", 
          alignItems: "flex-end", 
          justifyContent: "center",
          gap: "12px", 
          height: maxBarHeight + 80,
          padding: "0 10px",
          overflowX: "auto",
        }}>
          {data.map((assessment, index) => {
            const percentage = isScaleScore 
              ? (assessment.score / maxScore) * 100 
              : (assessment.score / assessment.max_score) * 100;
            const barHeight = Math.max((percentage / 100) * maxBarHeight, 20);
            const barColor = isScaleScore ? color : getBarColor(percentage);
            const displayScore = isScaleScore ? assessment.score : Math.round(percentage);
            
            const shortName = assessment.test_name?.replace(/Quiz|Unit Test|FAST Progress Monitoring|STAR/gi, "").trim() 
              || `#${index + 1}`;
            
            return (
              <div 
                key={assessment.id} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  minWidth: "50px",
                  maxWidth: "70px",
                }}
              >
                {/* Score on top */}
                <div style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: barColor,
                  marginBottom: "6px",
                  textShadow: `0 0 10px ${barColor}`,
                }}>
                  {displayScore}{isScaleScore ? "" : "%"}
                </div>
                
                {/* Bar */}
                <div style={{
                  width: "100%",
                  height: `${barHeight}px`,
                  background: `linear-gradient(to top, ${barColor}90, ${barColor})`,
                  borderRadius: "6px 6px 3px 3px",
                  boxShadow: `0 0 15px ${barColor}50`,
                  transition: "all 0.3s ease",
                  position: "relative",
                }}>
                  {!isScaleScore && calculatePointsFromPercentage(percentage) > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.7)",
                      color: "#fbbf24",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      fontSize: "9px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}>
                      +{calculatePointsFromPercentage(percentage)}
                    </div>
                  )}
                </div>
                
                {/* Assessment name */}
                <div style={{
                  fontSize: "9px",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginTop: "6px",
                  textAlign: "center",
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {shortName}
                </div>
                
                {/* Date */}
                <div style={{
                  fontSize: "8px",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: "2px",
                }}>
                  {new Date(assessment.date_given).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Count</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{data.length}</div>
          </div>
          {!isScaleScore && (
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Avg</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color }}>
                {Math.round(data.reduce((sum, a) => sum + (a.score / a.max_score * 100), 0) / data.length)}%
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "3px" }}>Points</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#fbbf24" }}>{pointsEarned}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          opacity: 0.25,
          filter: "hue-rotate(30deg) saturate(1.3)",
        }}
      >
        <source src="/reading-bg.mp4" type="video/mp4" />
      </video>

      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 50%, rgba(234, 88, 12, 0.2) 100%)",
        zIndex: -1,
      }} />

      <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "12px 24px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "30px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)";
            e.currentTarget.style.transform = "translateX(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            textShadow: "0 0 30px rgba(251, 191, 36, 0.6)",
          }}>
            📚 Reading Progress
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.7)" }}>
            Earn points with every assessment!
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "white" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }}>Loading your assessments...</div>
          </div>
        )}

        {!loading && (
          <>
            {/* Points Progress Meter */}
            <div style={{
              maxWidth: "1000px",
              margin: "0 auto 40px auto",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "28px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", color: "white", marginBottom: "8px" }}>🏆 Points Progress</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Earn points to reach 500!</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ 
                    fontSize: "52px", 
                    fontWeight: "900", 
                    color: progressColor, 
                    textShadow: `0 0 30px ${progressColor}`,
                    lineHeight: 1,
                  }}>
                    {pointsResult.totalPoints}
                  </div>
                  <div style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                    / 500 points
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ 
                position: "relative", 
                width: "100%", 
                height: "50px", 
                background: "rgba(0, 0, 0, 0.3)", 
                borderRadius: "25px", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)" 
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${Math.min(progressPercentage, 100)}%`,
                  background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}cc 100%)`,
                  borderRadius: "25px",
                  transition: "width 1s ease-out",
                  boxShadow: `0 0 30px ${progressColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "15px",
                }}>
                  {progressPercentage > 10 && (
                    <span style={{ 
                      fontSize: "16px", 
                      fontWeight: "700", 
                      color: "white",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}>
                      {Math.round(progressPercentage)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Points Breakdown */}
              <div style={{ 
                marginTop: "25px", 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
                gap: "15px" 
              }}>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(251, 191, 36, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>📝 Quizzes</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#fbbf24" }}>{pointsResult.quizPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>📋 Unit Tests</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#f59e0b" }}>{pointsResult.unitTestPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(234, 88, 12, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>🎯 FAST PM</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#ea580c" }}>{pointsResult.fastPmPoints}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>⭐ STAR</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>{pointsResult.starPoints}</div>
                </div>
              </div>

              <div style={{ 
                marginTop: "20px", 
                textAlign: "center", 
                fontSize: "18px", 
                fontWeight: "600", 
                color: progressColor 
              }}>
                {getEncouragementMessage(pointsResult.totalPoints)}
              </div>
            </div>

            {/* Bar Charts Grid */}
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}>
              <AssessmentBarChart data={quizzes} title="Quizzes" icon="📝" color="#fbbf24" pointsEarned={pointsResult.quizPoints} />
              <AssessmentBarChart data={unitTests} title="Unit Tests" icon="📋" color="#f59e0b" pointsEarned={pointsResult.unitTestPoints} />
              <AssessmentBarChart data={fastTests} title="FAST PM" icon="🎯" color="#ea580c" isScaleScore pointsEarned={pointsResult.fastPmPoints} />
              <AssessmentBarChart data={starTests} title="STAR" icon="⭐" color="#10b981" isScaleScore pointsEarned={pointsResult.starPoints} />
            </div>

            {/* Grades Summary Table */}
            {assessments.length > 0 && (
              <div style={{
                maxWidth: "1000px",
                margin: "40px auto 0 auto",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: "20px",
                padding: "25px",
                overflowX: "auto",
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "20px", textAlign: "center" }}>
                  📋 All Grades Summary
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.2)" }}>
                      <th style={{ padding: "12px 8px", textAlign: "left", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Assessment</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Type</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Score</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Grade</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Date</th>
                      <th style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...assessments]
                      .sort((a, b) => new Date(b.date_given).getTime() - new Date(a.date_given).getTime())
                      .map((a, idx) => {
                        const isScale = a.is_scale_score || a.assessment_type === "FAST Progress Monitoring" || a.assessment_type === "STAR";
                        const percentage = isScale ? null : Math.round((a.score / a.max_score) * 100);
                        const points = isScale ? (a.score >= 300 ? 25 : 15) : calculatePointsFromPercentage(percentage || 0);
                        const gradeColor = isScale 
                          ? (a.score >= 300 ? "#10b981" : "#3b82f6")
                          : getBarColor(percentage || 0);
                        
                        return (
                          <tr key={a.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                            <td style={{ padding: "12px 8px", color: "white" }}>{a.test_name}</td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>{a.assessment_type}</td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "white", fontWeight: "600" }}>
                              {a.score}{!isScale && `/${a.max_score}`}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <span style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                background: `${gradeColor}30`,
                                color: gradeColor,
                                fontWeight: "700",
                                fontSize: "13px",
                              }}>
                                {isScale ? (a.score >= 300 ? "Proficient" : "On Track") : `${percentage}%`}
                              </span>
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                              {new Date(a.date_given).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center", color: "#10b981", fontWeight: "700" }}>
                              +{points}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Points Legend */}
            <div style={{
              maxWidth: "800px",
              margin: "40px auto 0 auto",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "20px",
              padding: "25px",
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "15px", textAlign: "center" }}>
                📊 How Points Are Earned
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", textAlign: "center" }}>
                <div style={{ padding: "10px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#f59e0b" }}>70-79%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+5 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(251, 191, 36, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#fbbf24" }}>80-89%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+7 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(34, 197, 94, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#22c55e" }}>90-99%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+9 points</div>
                </div>
                <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#10b981" }}>100%</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>+15 points</div>
                </div>
              </div>
              <p style={{ 
                marginTop: "15px", 
                fontSize: "12px", 
                color: "rgba(255, 255, 255, 0.6)", 
                textAlign: "center" 
              }}>
                FAST PM & STAR tests earn bonus points for proficiency and growth!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
