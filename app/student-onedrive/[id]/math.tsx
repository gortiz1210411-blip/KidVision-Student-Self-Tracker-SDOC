"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { calculateSubjectPoints, getPointsColor, getEncouragementMessage, calculatePointsFromPercentage } from "@/utils/pointsCalculator";

interface MathAssessment {
  id: string;
  assessment_type: string;
  test_name: string;
  score: number;
  max_score: number;
  date_given: string;
  is_scale_score?: boolean;
}

export default function StudentMathPageOneDrive() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [assessments, setAssessments] = useState<MathAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        // --- ONEDRIVE/GRAPH API LOGIC START ---
        // TODO: Replace this with actual Microsoft Graph API call to fetch the JSON file from OneDrive
        // Example (pseudo):
        // const accessToken = await getAccessToken();
        // const response = await fetch(
        //   `https://graph.microsoft.com/v1.0/me/drive/root:/path/to/assessments/${studentId}-math.json:/content`,
        //   { headers: { Authorization: `Bearer ${accessToken}` } }
        // );
        // const data = await response.json();
        // setAssessments(data.assessments || []);
        // --- ONEDRIVE/GRAPH API LOGIC END ---
        setAssessments([]); // Remove this line when Graph API is implemented
      } catch (error) {
        console.error("Error fetching assessments from OneDrive:", error);
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAssessments();
    }
  }, [studentId]);

  // ...existing code for UI, points, charts, etc. (identical to your current engaging version)
  // For brevity, you can copy the full UI code from your current file here.

  // Calculate points using the new system
  const pointsResult = calculateSubjectPoints(assessments, "math");
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

  // ...existing AssessmentBarChart and UI code...
  // (Copy the rest of your current file's UI code here)

  // For brevity, the rest of the UI code is omitted in this snippet, but should be copied in full from your current file.

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* ...existing UI code... */}
      <div style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
        <b>OneDrive version (demo placeholder)</b>
      </div>
    </div>
  );
}
